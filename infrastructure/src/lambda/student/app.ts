namespace StudentApp {
    /// <reference types="express" />
    const express = require("express")
    const app = express()
    const bodyParser = require("body-parser")
    app.use(bodyParser.json())

    app.get("/student/hello", function (req: any, res: any) {
        res.send("Hello student")
    })

    module.exports = app
}
