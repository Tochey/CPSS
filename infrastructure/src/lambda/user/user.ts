const userServerlessWrapper = require("serverless-http")
const userLambdaApp = require("./app")

module.exports.lambdaHandler = userServerlessWrapper(userLambdaApp)
