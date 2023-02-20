import Axios from "axios"

let urls = {
    development: "http://localhost:8080/",
    production: "https://mpo126cgvl.execute-api.us-east-1.amazonaws.com/dev/ ",
}
const api = Axios.create({
    baseURL: urls[process.env.NODE_ENV as "development" | "production"],
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
})

export default api