import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { formatJSONResponse, s3TypeWrapper } from "@libs/api-gateway"
import { Readable } from "stream"
import prettyBytes from "pretty-bytes"

async function streamToString(stream: Readable): Promise<string> {
    return await new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = []
        stream.on("data", (chunk) => chunks.push(chunk))
        stream.on("error", reject)
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")))
    })
}

const transform: s3TypeWrapper = async (event) => {
    const { Records } = event
    const {
        s3: {
            bucket: { name },
            object: { key, size },
        },
    } = Records[0]

    console.log({size : prettyBytes(size), key})
    const client = new S3Client({})
    const command = new GetObjectCommand({ Bucket: name, Key: key })
    const {Body} = await client.send(command)

    let indexText = await streamToString(Body)
    
    console.log(JSON.stringify({data : indexText}))
    
    return formatJSONResponse({
        data : indexText
    })
}

export const main = transform
