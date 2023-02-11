
    const x = require("express")
    const studentExpressApp = x()
    const parse = require("body-parser")
    studentExpressApp.use(parse.json())

    studentExpressApp.get("/student/hello", function (req: any, res: any) {
        res.send("Hello student")
    })

    module.exports = studentExpressApp

