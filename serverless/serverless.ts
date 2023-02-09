import type { AWS } from "@serverless/typescript"

import hello from "@functions/hello"
import psUrl from "@functions/pre-signs"
import server from "@functions/server"
import transform from "@functions/transform"
import upload from "@functions/upload"
import student from "@functions/students"

const serverlessConfiguration: AWS = {
    service: "serverless",
    frameworkVersion: "3",
    useDotenv: true,
    plugins: ["serverless-esbuild", "serverless-offline"],
    provider: {
        name: "aws",
        runtime: "nodejs14.x",
        iam: {
            role: {
                statements: [
                    {
                        Effect: "Allow",
                        Action: ["s3:PutObject", "s3:GetObject"],
                        Resource: {
                            "Fn::Join": [
                                "",
                                [
                                    "arn:aws:s3:::",
                                    { Ref: "indexedSubmissionbucket" },
                                    "/*",
                                ],
                            ],
                        },
                    },
                    {
                        Effect: "Allow",
                        Action: [
                            "dynamodb:DescribeTable",
                            "dynamodb:Query",
                            "dynamodb:Scan",
                            "dynamodb:GetItem",
                            "dynamodb:PutItem",
                            "dynamodb:UpdateItem",
                        ],
                        Resource: { "Fn::GetAtt": ["userTable", "Arn"] },
                    },
                ],
            },
        },
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },

        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
            NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
            AGL_APPID: "${env:AGL_APPID}",
            ADMIN_API_KEY: "${env:ADMIN_API_KEY}",
            ALGOLIA_INDEX_NAME: "${env:ALGOLIA_INDEX_NAME}",
        },
    },
    resources: {
        Resources: {
            primarySubmissionBucket: {
                Type: "AWS::S3::Bucket",
                Properties: {
                    BucketName: "primary-submission-bucket",
                    CorsConfiguration: {
                        CorsRules: [
                            {
                                AllowedMethods: ["PUT"],
                                AllowedOrigins: ["*"],
                            },
                        ],
                    },
                },
            },
            indexedSubmissionbucket: {
                Type: "AWS::S3::Bucket",
                Properties: {
                    BucketName: "indexed-submission-bucket",
                    CorsConfiguration: {
                        CorsRules: [
                            {
                                AllowedMethods: ["PUT"],
                                AllowedOrigins: ["*"],
                            },
                        ],
                    },
                },
            },
            userTable: {
                Type: "AWS::DynamoDB::Table",
                Properties: {
                    TableName: "userTable",
                    AttributeDefinitions: [
                        {
                            AttributeName: "userId",
                            AttributeType: "S",
                        },
                        {
                            AttributeName: "email",
                            AttributeType: "S",
                        },
                    ],
                    KeySchema: [
                        {
                            AttributeName: "userId",
                            KeyType: "HASH",
                        },
                        {
                            AttributeName: "email",
                            KeyType: "RANGE",
                        },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1,
                    },
                },
            },
        },
    },

    functions: { hello, psUrl, transform, upload, server, student },

    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ["aws-sdk"],
            target: "node14",
            define: { "require.resolve": undefined },
            platform: "node",
            concurrency: 10,
            keepOutputDirectory: true,
        },
    },
}

module.exports = serverlessConfiguration
