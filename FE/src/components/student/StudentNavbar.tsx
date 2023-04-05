import React from "react"
import NavbarAnimation from "../NavbarAnimation"
import { Link } from "react-router-dom"
import { useAuth } from "../../lib/AuthContext"

const StudentNavbar = () => {
    const { user, studentLogout, getUser } = useAuth()
    return (
        <section>
            <nav className='md:py flex justify-evenly shadow-lg py-10'>
                <div className='w-1/2'>
                    <Link to='/'>
                        <h1 className='font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-primary to-pink-600 cursor-pointer'>
                            CPSS -{" "}
                            <span>
                                <NavbarAnimation />
                            </span>
                        </h1>
                    </Link>
                </div>
                <ul className='flex items-center gap-10'>
                    {user && (
                        <li>
                            <img
                                src={`https://api.dicebear.com/5.x/adventurer/svg?seed=${
                                    getUser()?.id
                                }`}
                                alt='avatar'
                                width={50}
                                height={50}
                            />
                        </li>
                    )}
                    <li>
                        <Link to={"/dashboard"}>
                            <p className='text-gray-400 font-bold'>Dashboard</p>
                        </Link>
                    </li>
                    <li>
                        <a
                            href='https://www.linkedin.com/in/tochidon/'
                            className='text-gray-400 font-bold'>
                            Creator
                        </a>
                    </li>
                    <li>
                        <a
                            href='https://github.com/Tochey/CPSS/blob/main/CONTRIBUTING.md'
                            className='text-gray-400 font-bold'>
                            Contribute
                        </a>
                    </li>
                    <li>
                        {user ? (
                            <p
                                className='text-gray-400 font-bold cursor-pointer'
                                onClick={() => studentLogout()}>
                                Logout
                            </p>
                        ) : (
                            <Link to={"/login"}>
                                <p className='text-gray-400 font-bold'>Login</p>
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>
        </section>
    )
}

export default StudentNavbar
