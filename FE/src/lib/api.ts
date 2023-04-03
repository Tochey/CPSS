import Axios from "axios";

const urls = {
    development: {
        IAM_ENDPOINT: "http://localhost:8080",
        USER_ENDPOINT: "http://localhost:8081",
    },
    production: {
        IAM_ENDPOINT: "https://mpo126cgvl.execute-api.us-east-1.amazonaws.com/dev/",
        USER_ENDPOINT: "https://mpo126cgvl.execute-api.us-east-1.amazonaws.com/dev/",
    },
};

const api = (baseURL: string) =>
    Axios.create({
        baseURL,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });

const iamEndpoint = api(
    process.env.NODE_ENV === "production" ? urls.production.IAM_ENDPOINT : urls.development.IAM_ENDPOINT
);
const userEndpoint = api(
    process.env.NODE_ENV === "production" ? urls.production.USER_ENDPOINT : urls.development.USER_ENDPOINT
);

const psEndpoint = api(
    process.env.NODE_ENV === "production" ? urls.production.USER_ENDPOINT  : "https://mpo126cgvl.execute-api.us-east-1.amazonaws.com/dev/"
);

export { iamEndpoint, userEndpoint, psEndpoint };

