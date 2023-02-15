import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Readable } from "stream"
import prettyBytes from "pretty-bytes"
import { APIGatewayProxyResult, Handler, S3CreateEvent } from "aws-lambda"
import { removeStopwords, eng } from "stopword"

type s3TypeWrapper = Handler<S3CreateEvent, APIGatewayProxyResult>

async function streamToString(stream: Readable): Promise<string> {
    return await new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = []
        stream.on("data", (chunk) => chunks.push(chunk))
        stream.on("error", reject)
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")))
    })
}

export const lambdaHandler: s3TypeWrapper = async (event) => {
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

    let userText = await streamToString(Body as Readable)
    const indexText = removeStopwords(userText.split(" "), eng).join(" ")

    return {
        statusCode: 200,
        body: JSON.stringify({
            data: indexText,
        }),
    }
}
