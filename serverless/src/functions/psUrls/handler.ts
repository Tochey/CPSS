import { formatJSONResponse } from "@libs/api-gateway"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { Handler } from "aws-lambda"

const psUrls: Handler = async (event) => {
    const client = new S3Client({})
    console.log(event)
    const params = { Bucket: "submission-bucket", Key: "test.txt" }
    const command = new PutObjectCommand(params)
    const res: string = await getSignedUrl(client, command, {
        expiresIn: 60 * 60,
    })

    return formatJSONResponse({
        res: res,
    })
}

export const main = psUrls
