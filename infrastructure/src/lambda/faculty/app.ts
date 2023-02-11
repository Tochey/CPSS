namespace FaultyApp {
    const express = require("express")
    const app = express()
    const bodyParser = require("body-parser")
    app.use(bodyParser.json())

    app.get("/faculty/hello", function (req: any, res: any) {
        res.send("Hello faculty")
    })
    module.exports = app
}
