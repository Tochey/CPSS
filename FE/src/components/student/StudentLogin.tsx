import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../lib/AuthContext"
import AnimatedSpinner from "../AnimatedSpinner"

function StudentLogin() {
    const [data, setData] = useState({ email: "", canvasAccessToken: "" })
    const [error, setError] = useState<string>("")
    const navigate = useNavigate()
    const { studentLogin } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const handleStudentChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (
        e
    ) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        const regex = /^[a-zA-Z0-9._%+-]+@salemstate\.edu$/
        if (!regex.test(data.email)) {
            setError("Please enter a valid Salem State email address")
            return
        }
        const error = await studentLogin(data)
        setIsLoading(false)
        if (
            error?.response &&
            error?.response.status >= 400 &&
            error?.response.status <= 500
        ) {
            setError(error.response.data)
        } else {
            navigate("/dashboard")
        }
    }

    return (
        <section className=''>
            <div className='flex flex-col items-center justify-center mt-10 '>
                <a className='flex items-center mb-6 text-transparent font-bold text-2xl bg-clip-text bg-gradient-to-r from-primary to-pink-600'>
                    Log in to CPSS
                </a>
                <div className='w-full rounded-md shadow  md:mt-0 sm:max-w-md xl:p-0'>
                    <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
                        <form className='space-y-4 md:space-y-6'>
                            <div>
                                <label
                                    htmlFor='email'
                                    className='block mb-2 text-sm font-medium text-gray-400'>
                                    Salem State Email
                                </label>
                                <input
                                    type='email'
                                    name='email'
                                    id='email'
                                    className='bg-black border border-gray-400 text-md rounded-lg  block w-full p-3 outline-none text-white hover:border-gray-300'
                                    placeholder='john_doe@salemstate.edu'
                                    required
                                    onChange={(e) => handleStudentChange(e)}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='canvasAccessToken'
                                    className='block mb-2 text-sm font-medium text-gray-400'>
                                    Canvas Access Token
                                </label>
                                <input
                                    type='password'
                                    name='canvasAccessToken'
                                    id='canvasAccessToken'
                                    placeholder='•••••••••••••'
                                    className='bg-black border border-gray-400 text-white text-md rounded-lg block w-full p-3 outline-none hover:border-gray-300'
                                    required
                                    onChange={(e) => handleStudentChange(e)}
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-start'>
                                    <div className='flex items-center h-5'>
                                        <input
                                            id='remember'
                                            aria-describedby='remember'
                                            type='checkbox'
                                            className='w-4 h-4 border border-gray-400 rounded bg-gray-50 p-4'
                                        />
                                    </div>
                                    <div className='ml-3 text-sm'>
                                        <label
                                            htmlFor='remember'
                                            className='text-gray-400'>
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                                <a
                                    href='#'
                                    className='text-sm font-medium text-gray-400 hover:underline '>
                                    Forgot password?
                                </a>
                            </div>
                            {error && (
                                <p className='pt-4 text-md font-bold italic  text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600'>
                                    {error}
                                </p>
                            )}
                            {isLoading && (
                                <div className='w-full text-center flex justify-center'>
                                    <AnimatedSpinner />
                                </div>
                            )}
                            <button
                                type='submit'
                                className='w-full text-gray-400 font-bold py-2 px-4 rounded border border-solid border-gray-400 hover:border-pink-600'
                                onClick={handleSubmit}>
                                Log in
                            </button>
                            <p className='text-sm font-light text-gray-400'>
                                Are you an admin?{" "}
                                <Link to={"/admin/login"}>
                                    <span className='font-medium text-primary-400 hover:underline'>
                                        Log in here
                                    </span>
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export { StudentLogin }
