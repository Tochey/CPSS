namespace FacultyLambda {
    const serverless = require("serverless-http")
    const app = require("./app")

    module.exports.lambdaHandler = serverless(app)
}
