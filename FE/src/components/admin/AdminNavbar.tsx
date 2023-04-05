import React from "react"
import NavbarAnimation from "../NavbarAnimation"
import { Link } from "react-router-dom"
import { useAuth } from "../../lib/AuthContext"

const AdminNavbar = () => {
    const { user, studentLogout, getUser } = useAuth()
    console.log(user)
    return (
        <section>
            <nav className='md:py flex justify-evenly shadow-lg py-10'>
                <ul className='flex items-center gap-10'>
                    <li>
                        <Link to={"/admin/students"}>
                            <p className='text-gray-400 font-bold hover:underline hover:text-white'>
                                Students
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/admin/schedule"}>
                            <p className='text-gray-400 font-bold hover:underline hover:text-white'>
                                Schedule
                            </p>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/admin/students"}>
                            <img
                                src={`https://api.dicebear.com/5.x/adventurer/svg?seed=${
                                    getUser()!.id
                                }`}
                                alt='avatar'
                                width={50}
                                height={50}
                            />
                        </Link>
                    </li>
                    <li>
                        <a
                            href='https://github.com/Tochey/CPSS/blob/main/CONTRIBUTING.md'
                            className='text-gray-400 font-bold hover:underline hover:text-white'>
                            Faculty
                        </a>
                    </li>
                    <li>
                        <Link to={"/admin/archive"}>
                            <p className='text-gray-400 font-bold hover:underline hover:text-white'>
                                Archive
                            </p>
                        </Link>
                    </li>
                    <li>
                        {user ? (
                            <p
                                className='text-gray-400 font-bold cursor-pointer hover:underline hover:text-white'
                                onClick={() => studentLogout()}>
                                Logout
                            </p>
                        ) : (
                            <Link to={"/login"}>
                                <p className='text-gray-400 font-bold hover:underline hover:text-white'>
                                    Login
                                </p>
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>
        </section>
    )
}

export default AdminNavbar
