import { formatJSONResponse, s3TypeWrapper } from "@libs/api-gateway"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { Readable } from "stream"

async function streamToString(stream: Readable): Promise<string> {
    return await new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = []
        stream.on("data", (chunk) => chunks.push(chunk))
        stream.on("error", reject)
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")))
    })
}

const transform: s3TypeWrapper = async (event) => {
    console.log(event)
    const { Records } = event
    const {
        s3: {
            bucket: { name },
            object: { key, size },
        },
    } = Records[0]

    console.log({ size, name })
    const client = new S3Client({})
    const command = new GetObjectCommand({ Bucket: name, Key: key })
    const response = await client.send(command)
    let res: Readable = response.Body
    console.log(await streamToString(res))
    return formatJSONResponse({
        event,
    })
}

export const main = transform
