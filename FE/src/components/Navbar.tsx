import { Link } from "react-router-dom"
import { useAuth } from "../lib/AuthContext"
import NavbarAnimation from "./NavbarAnimation"
import StudentNavbar from "./student/StudentNavbar"
import AdminNavbar from "./admin/AdminNavbar"
import { useEffect } from "react"

function Navbar() {
    const { getUser } = useAuth()

    const user = getUser()

    return user && user.ROLE === "ADMIN" ? <AdminNavbar /> : <StudentNavbar />
}

export { Navbar }
