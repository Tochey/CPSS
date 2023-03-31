import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import axios, { AxiosError, AxiosResponse } from "axios"
import parse from "body-parser"
import { serialize } from "cookie"
import cors from "cors"
import express from "express"
import jwt from "jsonwebtoken"
import { userModel } from "../../model/schema"
const app = express()
app.use(parse.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
    
}))

type CanvasUserObject = {
    id: number
    name: string
    short_name: string
    sortable_name: string
    title: string | null
    bio: string | null
    primary_email: string
    login_id: string
    integration_id: string | null
    time_zone: string
    locale: string | null
    effective_locale: "en"
    calendar: {
        ics: string
    }
    lti_user_id: string
    k5_user: boolean
}

type CanvasUserFolderObject = {
    id: number
    name: string
    full_name: string
    context_id: number
    context_type: string
    parent_folder_id: number
    created_at: string
    updated_at: string
    lock_at: null
    unlock_at: null
    position: number
    locked: boolean
    folders_url: string
    files_url: string
    files_count: number
    folders_count: number
    hidden: boolean
    locked_for_user: boolean
    hidden_for_user: boolean
    for_submissions: boolean
    can_upload: boolean
}

type CanvasUserFileObject = {
    id: number
    uuid: string
    folder_id: number
    display_name: string
    filename: string
    upload_status: string
    "content-type": string
    url: string
    size: number
    created_at: string
    updated_at: string
    unlock_at: null
    locked: boolean
    hidden: boolean
    lock_at: null
    hidden_for_user: boolean
    thumbnail_url: null
    modified_at: string
    mime_class: string
    media_entry_id: null
    category: string
    locked_for_user: boolean
}

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

const getUserSpecFolder = async (
    userId: string,
    accessToken: string
): Promise<CanvasUserFolderObject> => {
    return await axios
        .get(`https://canvas.instructure.com/api/v1/users/${userId}/folders`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(async (e: AxiosResponse<CanvasUserFolderObject[]>) => {
            let specFolder = (e.data as CanvasUserFolderObject[]).find((e) =>
                e.name.includes("COMP SCI CAPSTONE PROJECT SPEC")
            )

            if (!specFolder) {
                let nextLink = getNextLink(e.headers.link)
                while (nextLink && !specFolder) {
                    let res: AxiosResponse<CanvasUserFolderObject[]> =
                        await axios.get(nextLink, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        })
                    specFolder = (res.data as CanvasUserFolderObject[]).find(
                        (e) => e.name.includes("COMP SCI CAPSTONE PROJECT SPEC")
                    )

                    if (!specFolder) {
                        nextLink = getNextLink(res.headers.link)
                        continue
                    }

                    return specFolder
                }
                throw Error(
                    "You are not a computer science student, you are not allowed to use this service"
                )
            }

            return specFolder
        })
        .catch((e: AxiosError<any>) => {
            throw Error(e.response?.data.errors[0].message)
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

app.post("/iam/signup", async (req: express.Request, res: express.Response) => {
    const { accessToken } = req.body
    let user, specFolder

    try {
        user = await getUserInfo(accessToken)
        user = { ...user, ROLE: "STUDENT" }
        console.log("getting spec folder")
        specFolder = await getUserSpecFolder(user.id.toString(), accessToken)
        const { id, name, primary_email } = user as CanvasUserObject
        const student = await userModel.get({ userId: id.toString() })
        if (student) {
            throw Error("This access token has been used already")
        } else {
            await userModel.create({
                name: name,
                userId: id.toString(),
                email: primary_email,
                ROLE: "STUDENT",
                currClass: "CSC520",
            })
        }
    } catch (error) {
        return res.status(403).send(error.message)
    }

    const { id, name, primary_email, login_id } = user as CanvasUserObject

    const { files_url } = specFolder as CanvasUserFolderObject
    const files = await axios
        .get(files_url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(async (e: AxiosResponse<CanvasUserFileObject[]>) => {
            let paginatedVersions: Array<CanvasUserFileObject> = []

            let problemDescFile = (e.data as CanvasUserFileObject[]).filter(
                (e) =>
                    e.filename.includes("problem_desc.txt") &&
                    e["content-type"] === "text/plain"
            )

            let nextLink = getNextLink(e.headers.link)
            while (nextLink) {
                let res: AxiosResponse<CanvasUserFileObject[]> =
                    await axios.get(nextLink, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    })
                paginatedVersions = (res.data as CanvasUserFileObject[]).filter(
                    (e) =>
                        e.filename.includes("problem_desc.txt") &&
                        e["content-type"] === "text/plain"
                )
                problemDescFile.push(...paginatedVersions)
                nextLink = getNextLink(res.headers.link)
            }
            return problemDescFile
        })

    if (files.length === 0) {
        return res
            .status(401)
            .send(
                "Could not find problem.desc file. But you are signed up. Please Login"
            )
    }

    const latestProblemDesc = files.sort((a, b) => {
        return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    })[0]

    const problemDescdownloadUrl = await axios
        .get(
            `https://canvas.instructure.com/api/v1/files/${latestProblemDesc.id}/public_url`,
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

    const fullName = name.toLowerCase().split(" ")
    const prefix = `${
        fullName[0].charAt(0) + fullName[1] + "_" + login_id + "/"
    }`
    const fileName = prefix + "cpss_index.txt"

    // consider encoding with user netadata
    const client = new S3Client({})
    const command = new PutObjectCommand({
        Bucket: "indexed-submission-bucket",
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

    try {
        await client.send(command)
    } catch (error) {
        res.status(500).send(
            "Files were found but failed to upload to s3. Proceed to login"
        )
    }

    res.send("Successfully onboarded")
})

app.post("/iam/login", async (req: express.Request, res: express.Response) => {
    const { email, canvasAccessToken } = req.body
    let user

    try {
        user = await getUserInfo(canvasAccessToken)
        const { id, primary_email } = user as CanvasUserObject
        if (email !== primary_email) {
            throw Error("Canvas Email doesnt match with the email you provided")
        }
        let student = await userModel.get({ userId: id.toString() })
        if (!student) {
            throw Error("The email or access token was not found")
        }

        const Cookie = serialize(
            "cpss",
            jwt.sign(
                {
                    id: student.userId,
                    email: student.email,
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
        res.setHeader("Set-Cookie", Cookie)
        return res.status(200).json("Successfully logged in")
    } catch (error) {
        return res.status(403).send(error?.message)
    }
})

export { app }
