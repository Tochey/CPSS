import { handlerPath } from "@libs/handler-resolver"

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: "ANY",
                path : ''
            }
        },
        {
            http: {
                method: "ANY",
                path : '{proxy+}'
            }
        }
    ]
}