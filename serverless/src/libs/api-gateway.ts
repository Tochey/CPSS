import type {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Handler,
    S3CreateEvent,
} from "aws-lambda"
import type { FromSchema, JSONSchema } from "json-schema-to-ts"

type ValidatedAPIGatewayProxyEvent<S extends JSONSchema> = Omit<
    APIGatewayProxyEvent,
    "body"
> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S extends JSONSchema> = Handler<
    ValidatedAPIGatewayProxyEvent<S>,
    APIGatewayProxyResult
>
export type s3TypeWrapper = Handler<S3CreateEvent, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>) => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(response),
    }
}
