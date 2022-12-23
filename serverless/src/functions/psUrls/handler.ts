import { formatJSONResponse } from "@libs/api-gateway"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const psUrls = async () => {
    const client = new S3Client({})

    const params = { Bucket: "submission-bucket", Key: "test.txt" }
    const command = new PutObjectCommand(params)
    const res: Promise<string> = getSignedUrl(client, command, {
        expiresIn: 15 * 60,
    })

    return formatJSONResponse({
        res: await res,
    })
}

export const main = psUrls
