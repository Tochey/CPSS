import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { GetParametersByPathCommand, SSMClient } from "@aws-sdk/client-ssm"
import axios, { AxiosError, AxiosResponse } from "axios"
import { serialize } from "cookie"
import cors from "cors"
import express from "express"
import jwt from "jsonwebtoken"
import { userModel } from "./schema"
import {
    CanvasAssignment,
    CanvasCourse,
    CanvasSubmission,
    CanvasUserObject,
} from "./types/CanvasApi"

const app = express()
app.use(express.json())
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://main.d77mtlby88qvh.amplifyapp.com",
        ],
        credentials: true,
    })
)

const getUserInfo = async (accessToken: string): Promise<CanvasUserObject> => {
    return await axios
        .get("https://canvas.instructure.com/api/v1/users/self/profile", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then((e: AxiosResponse<CanvasUserObject>) => {
            return e.data
        })
        .catch((e: AxiosError<any>) => {
            throw Error(e.response?.data.errors[0].message)
        })
}

const getCapstoneCourseId = async (
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

const getCapstoneAssignmentId = async (
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
                    (e.name.toLowerCase().includes("problem description") ||
                        e.name.toLowerCase().includes("problem description"))
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
                                .includes("problem description") ||
                                e.name
                                    .toLowerCase()
                                    .includes("problem description"))
                    )

                    if (!capstoneSpecAssignment) {
                        nextLink = getNextLink(res.headers.link)
                        continue
                    }

                    return capstoneSpecAssignment.id
                }
                throw Error(
                    "The Problem Description assignment is not found, please contact the instructor - Bo Hatfield"
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

const getProblemDescAttachmentIdIfPresent = async (
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
                throw Error(
                    "You have not submitted your problem description yet"
                )
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

            return e.data.attachments[0].id
        })
        .catch((e: any) => {
            if (e instanceof AxiosError<any>) {
                throw Error(e.response?.data.errors[0].message)
            }

            throw Error(e.message)
        })
}

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

const getFileDownloadUrl = async (
    attachmentId: number,
    accessToken: string
) => {
    const problemDescdownloadUrl = await axios
        .get(
            `https://canvas.instructure.com/api/v1/files/${attachmentId.toString()}/public_url`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        )
        .then((e: AxiosResponse<{ public_url: string }>) => {
            return e.data.public_url
        })

    const content = await axios
        .get(problemDescdownloadUrl)
        .then((e: AxiosResponse<string>) => {
            return e.data
        })
    return content
}

const uploadToS3 = async (
    name: string,
    login_id: string,
    id: number,
    primary_email: string,
    content: string
): Promise<void> => {
    const fullName = name.toLowerCase().split(" ")
    const prefix = `${
        fullName[0].charAt(0) + fullName[1] + "_" + login_id + "/"
    }`
    const fileName = prefix + "cpss_index.txt"

    const client = new S3Client({})
    const command = new PutObjectCommand({
        Bucket:
            process.env.INDEXEDBUCKETNAME || "indexed-submission-bucket21312",
        Key: fileName,
        ContentType: "text/plain",
        Body: content,
        Metadata: {
            userId: id.toString(),
            name: name,
            email: primary_email,
            login_id: login_id,
        },
    })

    await client.send(command)
}

app.post("/iam/signup", async (req: express.Request, res: express.Response) => {
    const { accessToken } = req.body
    let user, courseId: number, problemDescId: number, attachmentId: number

    try {
        user = await getUserInfo(accessToken)
        user = { ...user, ROLE: "STUDENT", accessToken: accessToken }
        console.log("getting spec folder")
        courseId = await getCapstoneCourseId(user.id.toString(), accessToken)
        problemDescId = await getCapstoneAssignmentId(courseId, accessToken)
        attachmentId = await getProblemDescAttachmentIdIfPresent(
            courseId,
            problemDescId,
            user.id.toString(),
            accessToken
        )
        const content = await getFileDownloadUrl(attachmentId, accessToken)
        const { id, name, primary_email, login_id } = user as CanvasUserObject
        await uploadToS3(name, login_id, id, primary_email, content)
        const student = await userModel.get({ userId: id.toString() })
        if (student) {
            throw Error("This access token has been used already")
        }

        await userModel.create({
            name: name,
            userId: id.toString(),
            email: primary_email,
            ROLE: "STUDENT",
            is_graduated: false,
            is_520_student: true,
            student_id: user.login_id,
            has_uploaded_capstone: false,
            has_uploaded_520_capstone: false,
            accessToken: accessToken,
        })
    } catch (error) {
        console.log(error)
        return res.status(403).send(error.message)
    }
    res.status(200).send("Successfully onboarded")
})

app.post("/iam/login", async (req: express.Request, res: express.Response) => {
    res.setHeader("Access-Control-Allow-Credentials", "true")
    const { email, canvasAccessToken } = req.body
    let user

    try {
        user = await getUserInfo(canvasAccessToken)
        const { id, primary_email } = user as CanvasUserObject
        if (email !== primary_email) {
            throw Error("Canvas Email doesnt match with the email you provided")
        }
        let student = await userModel.get({
            userId: id.toString(),
            ROLE: "STUDENT",
        })
        if (!student) {
            throw Error("The email or access token was not found")
        }

        if (student.is_graduated) {
            throw Error(
                "You are a graduated student, you cannot use this service"
            )
        }

        const Cookie = serialize(
            "cpss",
            jwt.sign(
                {
                    id: student.userId,
                    ROLE: student.ROLE,
                },
                "6JC2gq6aJo/xx/oB2J2WKaQ8XPQQgV9t4X4WJb89pR8=",
                {
                    expiresIn: "2h",
                }
            ),
            {
                httpOnly: false,
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7, // expires in 1 week
                path: "/",
            }
        )
        return res.status(200).json(Cookie)
    } catch (error) {
        return res.status(403).send(error?.message)
    }
})

app.post(
    "/iam/admin/login",
    async (req: express.Request, res: express.Response) => {
        res.setHeader("Access-Control-Allow-Credentials", "true")
        const { email, password } = req.body

        const ssmClient = new SSMClient({})
        const prefix = "/cpss/admin"

        const config = {
            Path: prefix,
            WithDecryption: false,
            Recursive: true,
        }

        const command = new GetParametersByPathCommand(config)
        const response = await ssmClient.send(command)

        const adminEmail = response.Parameters?.find(
            (e) => e.Name === `${prefix}/email`
        )?.Value
        const adminPassword = response.Parameters?.find(
            (e) => e.Name === `${prefix}/password`
        )?.Value

        if (email !== adminEmail || password !== adminPassword) {
            return res
                .status(403)
                .send(
                    "Invalid email or password, Check AWS Parameter Store for the correct credentials"
                )
        }

        try {
            const Cookie = serialize(
                "cpss",
                jwt.sign(
                    {
                        id: adminEmail,
                        ROLE: "ADMIN",
                    },
                    "6JC2gq6aJo/xx/oB2J2WKaQ8XPQQgV9t4X4WJb89pR8=",
                    {
                        expiresIn: "2h",
                    }
                ),
                {
                    httpOnly: false,
                    sameSite: "strict",
                    maxAge: 60 * 60 * 24 * 7, // expires in 1 week
                    path: "/",
                }
            )

            return res.status(200).json(Cookie)
        } catch (error) {
            return res.status(403).send(error?.message)
        }
    }
)

export { app }
