const x = require("express")
const studentExpressApp = x()
const parse = require("body-parser")
const dynamoose = require("dynamoose")
studentExpressApp.use(parse.json())
const catModel = require("./model/student.schema")

studentExpressApp.get("/student/hello", async function (req: any, res: any) {
    return res.send("Hello Student")
})
studentExpressApp.get("/student/deploy", async function (req: any, res: any) {
    return res.json({
        hash: await new catModel({
            userId: "1",
            age: 13,
            email: "tochey@outlook.com",
        }).save(),
    })
})

module.exports = studentExpressApp
module.exports.devConnect = async (env: string): Promise<string> => {
    if (env === "dev") {
        await dynamoose.aws.ddb.local()
    }

    return "Connected to dev dynamo"
}
