const axios = require("axios")
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")

const client = new S3Client({})

const main = async () => {
    return await axios
        .get(
            "https://canvas.instructure.com/api/v1/files/80000109099897/public_url",
            {
                headers: {
                    Authorization:
                        "Bearer 8~h9KipNy37bwteKUlCXdZC0FuLHlwTWws3lQHaZQHAkHHPUTguo9DvPZYWDj9dh2U",
                },
            }
        )
        .then(async (res) => {
            await axios
                .get(res.data.public_url, {
                    responseType: "arraybuffer",
                })
                .then((res) => {
                    console.log(res.data)
                    const buffer = Buffer.from(res.data)
                    const command = new PutObjectCommand({
                        Bucket:
                            process.env.INDEXEDBUCKETNAME ||
                            "indexed-submission-bucket",
                        Key: "text.zip",
                        ContentType: "application/zip",
                        Body: buffer,
                    })
                    client.send(command).then((e) => {
                        console.log(e)
                    })
                })
                .catch(console.error)
        })
        .catch((err) => {
            console.error(err)
            return err
        })
}

main().then(console.log)
