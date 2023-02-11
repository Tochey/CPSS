const ex = require("express")
const facultyExpressApp = ex()
const bodyParser = require("body-parser")
facultyExpressApp.use(bodyParser.json())

facultyExpressApp.get("/faculty/hello", function (req: any, res: any) {
    res.send("Hello faculty")
})
module.exports = facultyExpressApp
