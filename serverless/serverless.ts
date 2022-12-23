import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import psUrl from '@functions/psUrls';
import transform from '@functions/transform';

const serverlessConfiguration: AWS = {
  service: 'serverless',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ['s3:PutObject', 's3:GetObject'],
            Resource: 'arn:aws:s3:::submission-bucket/*'
          }
        ]
      }
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  resources: {
    Resources: {
      submissionbucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: 'submission-bucket',
        },
      },
    }
  },

  functions: { hello, psUrl, transform },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
