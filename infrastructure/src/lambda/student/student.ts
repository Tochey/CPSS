
    const studentServerlessWrapper = require("serverless-http")
    const studentLambdaApp = require("./app")

    module.exports.lambdaHandler = studentServerlessWrapper(studentLambdaApp)

