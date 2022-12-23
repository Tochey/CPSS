import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway"
import { formatJSONResponse } from "@libs/api-gateway"
import { middyfy } from "@libs/lambda"
import helloSchema from "@model/apigw/helloSchema"

const hello: ValidatedEventAPIGatewayProxyEvent<typeof helloSchema> = async (
    event
) => {
    return formatJSONResponse({
        message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
        event,
    })
}

export const main = middyfy(hello)
