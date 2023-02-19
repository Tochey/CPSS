import type { Handler, S3CreateEvent } from "aws-lambda"
import { APIGatewayProxyResult } from "aws-lambda"
import algoliasearch from "algoliasearch"
import { v4 as uuidv4 } from "uuid"

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
let client = algoliasearch(process.env.APPID!, process.env.ADMINAPIKEY!)

export const lambdaHandler: Handler<asyncLambdaEvent> = async (event) => {
    let {
        responsePayload: { body },
    } = event

    let parsedBody = JSON.parse(body)
    const {
        data: { indexText, metaData, rawText },
    } = parsedBody

    try {
        const index = client.initIndex("test_index")
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
