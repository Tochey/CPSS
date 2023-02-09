import { handlerPath } from "@libs/handler-resolver"

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: "ANY",
                path: "students",
            },
        },
        {
            http: {
                method: "ANY",
                path: "/students/{proxy+}",
            },
        },
    ],
}