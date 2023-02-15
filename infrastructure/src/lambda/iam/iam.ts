namespace IamLambda {
    const serverless = require("serverless-http")
    const app = require("./app")

    module.exports.lambdaHandler = serverless(app)
}
