namespace Infrastructure.Lambda.User {
    const userServerlessWrapper = require("serverless-http")
    const { app } = require("./app")

    module.exports.lambdaHandler = userServerlessWrapper(app)
}
