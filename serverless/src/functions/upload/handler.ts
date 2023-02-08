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

const upload: Handler<asyncLambdaEvent> = async (event) => {
    let {
        responsePayload: { body },
    } = event
    const client = algoliasearch(
        process.env.AGL_APPID!,
        process.env.ADMIN_API_KEY!
    )

    let parsedBody = JSON.parse(body)
    const { data } = parsedBody
    const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME!)

    const record = { objectID: uuidv4(), data: data }
    try {
        await index.saveObject(record)
    } catch (error) {
        console.log(error)
    }
}

export const main = upload
