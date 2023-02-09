import { handlerPath } from "@libs/handler-resolver"

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            http: {
                method: "POST",
                path: "psURLs",
                cors: {
                    origin: "*",
                    headers: [
                        "Content-Type",
                        "X-Amz-Date",
                        "Authorization",
                        "X-Api-Key",
                        "X-Amz-Security-Token",
                        "X-Amz-User-Agent",
                    ],
                    allowCredentials: false,
                },
            },
        },
    ],
}
