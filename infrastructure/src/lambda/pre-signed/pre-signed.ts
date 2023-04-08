import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Handler,
} from "aws-lambda"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler: Handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const client = new S3Client({})
    const e = JSON.parse(event.body || "{}")

    const params = { Bucket: process.env.INDEXEDBUCKETNAME, Key: e.fileName }
    const command = new GetObjectCommand(params)
    const res: string = await getSignedUrl(client, command, {
        expiresIn: 10,
    })

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
        },
        body: JSON.stringify({
            url: res,
        }),
    }
}
