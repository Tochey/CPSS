import { Request, Response } from "express"
const express = require("express")
const serverless = require("serverless-http")
const app = express()
app.use(express.json())

console.log("Hello from the serverless function!")

app.get("/", async (req: Request, res: Response) => {
    res.send("tHIS IS WORKING!")
})

app.get("/hello", async (req: Request, res: Response) => {
    res.send("Hello World!")
})

export const main = serverless(app)
