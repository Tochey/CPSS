import { Request, Response } from "express"

const serverless = require("serverless-http")
const express = require("express")
const app = express()

app.get("/", function (req: Request, res: Response) {
    res.send("Hello World!")
})

app.get("/admin", function (req: Request, res: Response) {
    res.send("hello admin")
})

app.get("/student", function (req: Request, res: Response) {
    res.send("hello student")
})

export const main = serverless(app)
