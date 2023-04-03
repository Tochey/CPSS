import type { Handler, S3CreateEvent } from "aws-lambda"
import { APIGatewayProxyResult } from "aws-lambda"
import algoliasearch from "algoliasearch"
import { v4 as uuidv4 } from "uuid"
import { SSMClient, GetParametersByPathCommand } from "@aws-sdk/client-ssm"

type asyncLambdaEvent = {
    version: string
    timestamp: string
    requestContext: {
        requestId: string
        functionArn: string
        condition: string
        approximateInvokeCount: number
    }
    requestPayload: { Records: [S3CreateEvent] }
    responseContext: { statusCode: number; executedVersion: string }
    responsePayload: APIGatewayProxyResult
}

export const lambdaHandler: Handler<asyncLambdaEvent> = async (event) => {
    let {
        responsePayload: { body },
    } = event

    let parsedBody = JSON.parse(body)
    const {
        data: { indexText, metaData, rawText },
    } = parsedBody

    const ssmClient = new SSMClient({})
    const prefix = "/cpss/algolia"

    const config = {
        Path: prefix,
        WithDecryption: false,
        Recursive: true,
    }

    const command = new GetParametersByPathCommand(config)
    const response = await ssmClient.send(command)

    const appid = response.Parameters!.find(
        (p) => p.Name === `${prefix}/appid`
    )?.Value
    const adminApiKey = response.Parameters!.find(
        (p) => p.Name === `${prefix}/adminapikey`
    )?.Value
    const indexName = response.Parameters!.find(
        (p) => p.Name === `${prefix}/indexname`
    )?.Value
    let alogoliaClient = algoliasearch(appid!, adminApiKey!)

    try {
        const index = alogoliaClient.initIndex(indexName!)
        const record = {
            objectID: uuidv4(),
            indexed_text: indexText,
            meta_data: metaData,
            raw_text: rawText,
        }
        await index.saveObject(record)
    } catch (error) {
        console.log(error)
    }
}
