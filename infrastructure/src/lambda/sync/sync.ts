import { SQSEvent } from "aws-lambda"
import axios, { AxiosError, AxiosResponse } from "axios"
import { CanvasCourse, CanvasSubmission } from "./types/CanvasApi"
import { CanvasAssignment } from "./types/CanvasApi"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { userModel } from "./schema"

type CustomSQSBody = {
    studentId: string
    accessToken: string
    className: string
}

type CustomSQSEvent = Omit<SQSEvent, "Records"> & {
    Records: Array<
        Omit<SQSEvent["Records"][0], "body"> & { body: CustomSQSBody }
    >
}
type SyncRespose = (sid: string, acessToken: string) => Promise<void>

const getNextLink = (linkHeader: string) => {
    const links = linkHeader.split(",")
    for (let i = 0; i < links.length; i++) {
        const link = links[i].trim()
        if (link.includes('rel="next"')) {
            let nextUrl = link.substring(
                link.indexOf("<") + 1,
                link.indexOf(">")
            )
            return nextUrl
        }
    }
    return null
}

const get520CapstoneCourseId = async (
    userId: string,
    accessToken: string
): Promise<number> => {
    return await axios
        .get(`https://canvas.instructure.com/api/v1/users/${userId}/courses`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(async (e: AxiosResponse<CanvasCourse[]>) => {
            let capstoneSpecCourse = e.data.find(
                (e) =>
                    e.name &&
                    (e.name.toLowerCase().includes("capstone project spec") ||
                        e.name.toLowerCase().includes("csc 520"))
            )

            if (!capstoneSpecCourse) {
                let nextLink = getNextLink(e.headers.link)
                while (nextLink && !capstoneSpecCourse) {
                    let res: AxiosResponse<CanvasCourse[]> = await axios.get(
                        nextLink,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    )
                    let capstoneSpecCourse = res.data.find(
                        (e) =>
                            e.name &&
                            (e.name
                                .toLowerCase()
                                .includes("capstone project spec") ||
                                e.name.toLowerCase().includes("csc 520"))
                    )

                    if (!capstoneSpecCourse) {
                        nextLink = getNextLink(res.headers.link)
                        continue
                    }

                    return capstoneSpecCourse.id
                }
                throw Error(
                    "You are not a computer science student, you are not allowed to use this service"
                )
            }

            return capstoneSpecCourse.id
        })
        .catch((e: any) => {
            if (e instanceof AxiosError<any>) {
                throw Error(e.response?.data.errors[0].message)
            }

            throw Error(e.message)
        })
}

const getCapstone520AssignmentId = async (
    courseId: number,
    accessToken: string
): Promise<number> => {
    return await axios
        .get(
            `https://canvas.instructure.com/api/v1/courses/${courseId}/assignments`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        .then(async (e: AxiosResponse<CanvasAssignment[]>) => {
            let capstoneSpecAssignment = e.data.find(
                (e) =>
                    e.name &&
                    (e.name.toLowerCase().includes("csc520 submission") ||
                        e.name.toLowerCase().includes("final Submission"))
            )

            if (!capstoneSpecAssignment) {
                let nextLink = getNextLink(e.headers.link)
                while (nextLink && !capstoneSpecAssignment) {
                    let res: AxiosResponse<CanvasAssignment[]> =
                        await axios.get(nextLink, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        })
                    capstoneSpecAssignment = res.data.find(
                        (e) =>
                            e.name &&
                            (e.name
                                .toLowerCase()
                                .includes("csc520 submission") ||
                                e.name
                                    .toLowerCase()
                                    .includes("final Submission"))
                    )

                    if (!capstoneSpecAssignment) {
                        nextLink = getNextLink(res.headers.link)
                        continue
                    }

                    return capstoneSpecAssignment.id
                }
                throw Error(
                    "The CSC520 Submission assignment is not found, please contact the instructor - Bo Hatfield"
                )
            }

            return capstoneSpecAssignment.id
        })
        .catch((e: any) => {
            if (e instanceof AxiosError<any>) {
                throw Error(e.response?.data.errors[0].message)
            }

            throw Error(e.message)
        })
}

const getCapstoneDocAttachmentIdIfPresent = async (
    courseId: number,
    assignmentId: number,
    userId: string,
    accessToken: string
): Promise<number> => {
    return await axios
        .get(
            `https://canvas.instructure.com/api/v1/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        .then(async (e: AxiosResponse<CanvasSubmission>) => {
            if (!e.data.attachments) {
                throw Error("You have not final Capstone Document yet")
            }

            if (e.data.attachments.length > 1) {
                const latestProblemDesc = e.data.attachments.sort((a, b) => {
                    return (
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                })[0]
                return latestProblemDesc.id
            }

            if (e.data.attachments[0]["content-type"] !== "application/zip") {
                throw Error("Your capstone document has to be a zip file")
            }

            return e.data.attachments[0].id
        })
        .catch((e: any) => {
            if (e instanceof AxiosError<any>) {
                throw Error(e.response?.data.errors[0].message)
            }

            throw Error(e.message)
        })
}

const getFileDownloadUrl = async (
    attachmentId: number,
    accessToken: string
) => {
    const problemDescdownloadUrl = await axios
        .get(
            `https://canvas.instructure.com/api/v1/files/${attachmentId}/public_url`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        .then((e: AxiosResponse<{ public_url: string }>) => {
            return e.data.public_url
        })

    return await axios
        .get(problemDescdownloadUrl, {
            responseType: "arraybuffer",
        })
        .then((e: AxiosResponse<string>) => {
            return e.data
        })
}

const Sync520Documents: SyncRespose = async (sid, accessToken) => {
    const courseId = await get520CapstoneCourseId(sid, accessToken)
    const capstoneId = await getCapstone520AssignmentId(courseId, accessToken)
    const attachmentId = await getCapstoneDocAttachmentIdIfPresent(
        courseId,
        capstoneId,
        sid,
        accessToken
    )
    const fileContent = await getFileDownloadUrl(attachmentId, accessToken)
    const user = await userModel.get({ userId: sid })

    if (user === null) {
        throw Error("User not found")
    }
    console.log(user)
    const { name, email, userId, student_id } = user
    const fullName = name.toLowerCase().split(" ")
    const prefix = `${
        fullName[0].charAt(0) + fullName[1] + "_" + student_id + "/"
    }`
    const fileName = prefix + "520_FINAL_SUBMISSION.zip"
    const client = new S3Client({ region: "us-east-1" })
    const buffer = Buffer.from(fileContent)
    const command = new PutObjectCommand({
        Bucket:
            process.env.SUBMISSION_BUCKET_NAME ||
            "primary-submission-bucket21312",
        Key: fileName,
        ContentType: "application/zip",
        Body: buffer,
        Metadata: {
            userId: userId,
            name: name,
            email: email,
            login_id: student_id,
        },
    })

    await client.send(command)

    const res = await userModel.update(
        { userId: sid },
        { has_uploaded_520_capstone: true }
    )
    console.log(res)
}

const Sync521Documents = () => {}

export const handler = async (event: CustomSQSEvent) => {
    const { Records } = event
    const body: CustomSQSBody = JSON.parse(Records[0].body as unknown as string)

    const { studentId, accessToken, className } = body

    try {
        if (className === "520") {
            await Sync520Documents(studentId, accessToken)
        } else if (className === "521") {
            Sync521Documents()
        }
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message,
            }),
        }
    }

    const response = {
        statusCode: 200,
        body: "Hello, World!",
    }

    return response
}
