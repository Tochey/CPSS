import express from "express"
import parse from "body-parser"
import { studentModel } from "../../model/student.schema"
import cors from "cors"
import axios, { AxiosResponse, AxiosError, Axios } from "axios"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import fs from "fs"
const app = express()
app.use(parse.json())
app.use(cors())

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
                throw new Error(
                    "You are not a computer science student, your are not alowed to use this service"
                )
            }

            return specFolder
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
    const user = await axios
        .get("https://canvas.instructure.com/api/v1/users/self/profile", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then((e: AxiosResponse<CanvasUserObject>) => {
            return e.data
        })
        .catch((e: AxiosError<{ errors: {} }>) => {
            return e.response?.data
        })

    if (typeof user === "object" && user.hasOwnProperty("errors")) {
        return res.status(401).send("Invalid Access Token")
    }

    const { id, name, primary_email, login_id } = user as CanvasUserObject
    let specFolder

    try {
        specFolder = await getUserSpecFolder(id.toString(), accessToken)
    } catch (error) {
        return res.status(403).send(error.message)
    }

    // try {
    //    const student =  await studentModel.get({ userId: id.toString() })
    //    if(student) {
    //        return res.status(404).send("This access token has been used already")
    //    }
    // } catch (error) {
    //     console.log(error)
    //     return res.status(500).send("Couldnt get user from database")
    // }

    // try {
    //     await studentModel.create({
    //         name: name,
    //         userId: id.toString(),
    //         email: primary_email,
    //     })
    // } catch (error) {
    //     console.log(error)
    //     return res.status(500).send("Couldnt add user to database")
    // }

    const { files_url } = specFolder as CanvasUserFolderObject
    const files = await axios
        .get(files_url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(async (e: AxiosResponse<CanvasUserFileObject[]>) => {
            const versions: Array<CanvasUserFileObject> = []
            let problemDescFile = (e.data as CanvasUserFileObject[]).find(
                (e) =>
                    e.filename.includes("problem_desc.txt") &&
                    e["content-type"] === "text/plain"
            )

            problemDescFile && versions.push(problemDescFile)

            if (e.headers.link) {
                let nextLink = getNextLink(e.headers.link)
                while (nextLink) {
                    console.log(e.headers.link)
                    let res: AxiosResponse<CanvasUserFileObject[]> =
                        await axios.get(nextLink, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        })
                    problemDescFile = (res.data as CanvasUserFileObject[]).find(
                        (e) =>
                            e.filename.includes("problem_desc.txt") &&
                            e["content-type"] === "text/plain"
                    )

                    problemDescFile && versions.push(problemDescFile)
                    nextLink = getNextLink(res.headers.link)
                }
            }
            return versions
        })

    console.log(files)

    if (files.length === 0) {
        return res
            .status(401)
            .send("Could not find problem.desc file. But you are signed up")
    }

    const latestProblemDesc = files.sort((a, b) => {
        return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    })[0]

    // console.log(latestProblemDesc)

    //     const problemDescdownloadUrl = await axios.get(`https://canvas.instructure.com/api/v1/files/${latestProblemDesc.id}/public_url`, {
    //         headers: {
    //             Authorization: `Bearer ${accessToken}`,
    //         },
    //     }).then((e: AxiosResponse<{ public_url: string }>) => {
    //         return e.data.public_url
    //     })

    //     const content = await axios.get(problemDescdownloadUrl).then((e: AxiosResponse<string>) => {
    //         return e.data
    //     })

    //     const fileName = `${name.split(" ").join("_")}_${login_id}_index.txt`

    // // consider encoiding with user netadata
    //     const client = new S3Client({})
    //     const command = new PutObjectCommand({
    //         Bucket: "indexed-submission-bucket",
    //         Key: fileName,
    //         ContentType: "text/plain",
    //         Body : content,
    //         Metadata : {
    //             "userId": id.toString(),
    //             "name": name,
    //             "email": primary_email,
    //             "login_id": login_id
    //         },
    //     })

    //     try {
    //         const data = await client.send(command)
    //         console.log(data)
    //     }catch (error) {
    //         console.log(error)
    //     }

    res.send("User Created successfully")
})

export { app }
