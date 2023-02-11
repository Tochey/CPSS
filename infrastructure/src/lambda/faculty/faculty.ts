
    const facultyServerlessApp = require("serverless-http")
    const facultyLambdaApp = require("./app")

    module.exports.lambdaHandler = facultyServerlessApp(facultyLambdaApp)

