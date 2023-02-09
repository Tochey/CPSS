import { Request, Response } from "express"
import * as dynamoose from "dynamoose"
const serverless = require("serverless-http")
const express = require("express")
const app = express()
app.use(express.json())

const schema = new dynamoose.Schema(
    {
        userId: String,
        email: String,
        age: Number,
    },
    {
        saveUnknown: false,
        timestamps: true,
    }
)

const Cat = dynamoose.model("Cat", schema)
const Table = new dynamoose.Table("userTable", [Cat])

enum ROLE {
    FACULTY = "FACULTY",
    STUDENT = "STUDENT",
}
interface IUserSignup {
    fullName: string
    email: string
    password: string
    ROLE: ROLE
}

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello World!")
})

// app.post("/signup", async (req: Request<{}, {}, IUserSignup>, res: Response) => {

//     return res.json({
//         hash: await new Cat({
//             userId: "1",
//             age: 13,
//             email : "tochey@outlook.com"
//         }).save()
//     })

// })

app.get("/signup", async (req: Request, res: Response) => {
    res.send("hello student")
})

export const main = serverless(app)
