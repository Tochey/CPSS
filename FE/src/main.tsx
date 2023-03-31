import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import AuthContextProvider from "./lib/AuthContext"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <AuthContextProvider>
        <App />
    </AuthContextProvider>
)
