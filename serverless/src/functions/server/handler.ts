import { Request, Response } from "express"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
const serverless = require("serverless-http")
const express = require("express")
const app = express()
const dbClient = new DynamoDBClient({ region: "us-east-1" });

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
