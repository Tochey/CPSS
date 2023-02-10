import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Readable } from "stream"
import prettyBytes from "pretty-bytes"
import { APIGatewayProxyResult, Handler, S3CreateEvent } from "aws-lambda"

type s3TypeWrapper = Handler<S3CreateEvent, APIGatewayProxyResult>

async function streamToString(stream: Readable): Promise<string> {
    return await new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = []
        stream.on("data", (chunk) => chunks.push(chunk))
        stream.on("error", reject)
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")))
    })
}

export const lambdahandler: s3TypeWrapper = async (event) => {
    const { Records } = event
    const {
        s3: {
            bucket: { name },
            object: { key, size },
        },
    } = Records[0]

    console.log({ size: prettyBytes(size), key })
    const client = new S3Client({})
    const command = new GetObjectCommand({ Bucket: name, Key: key })
    const { Body } = await client.send(command)

    let indexText = await streamToString(Body as Readable)

    console.log(JSON.stringify({ data: indexText }))

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            data: indexText,
        }),
    }

    return response
}
