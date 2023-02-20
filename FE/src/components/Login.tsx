import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../lib/api"

function Login() {
    const [data, setData] = useState({ email: "", accessToken: "" })
    const [error, setError] = useState<string>("")
    const navigate = useNavigate()

    const handleStudentChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (
        e
    ) => {
        e.preventDefault()
        setError("")
        const regex = /^[a-zA-Z0-9._%+-]+@salemstate\.edu$/
        if (!regex.test(data.email)) {
            setError("Please enter a valid Salem State email address")
            return
        }
        try {
            await api.post("/iam/login", data)
            navigate("/dashboard")
        } catch (error: any) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data)
            }
        }
    }

    return (
        <section className=''>
            <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 '>
                <a
                    href='#'
                    className='flex items-center mb-6 text-transparent font-bold text-2xl bg-clip-text bg-gradient-to-r from-primary to-pink-600'>
                    Log in to CPSS
                </a>
                <div className='w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-black border-gray-400'>
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
                                    className='bg-black border border-gray-300  sm:text-sm rounded-lg  block w-full p-2.5 outline-none text-white '
                                    placeholder='name@company.com'
                                    required
                                    onChange={(e) => handleStudentChange(e)}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='accessToken'
                                    className='block mb-2 text-sm font-medium text-gray-400'>
                                    Canvas Access Token
                                </label>
                                <input
                                    type='password'
                                    name='accessToken'
                                    id='accessToken'
                                    placeholder='••••••••'
                                    className='bg-black border border-gray-300 text-white sm:text-sm rounded-lg block w-full p-2.5 outline-none'
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
                                            className='w-4 h-4 border border-gray-300 rounded bg-gray-50 '
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
                            <button
                                type='submit'
                                className='w-full text-gray-400 font-bold py-2 px-4 rounded border border-solid border-gray-400 hover:border-pink-600'
                                onClick={handleSubmit}>
                                Log in
                            </button>
                            <p className='text-sm font-light text-gray-400'>
                                Are you an admin?{" "}
                                <a
                                    href='#'
                                    className='font-medium text-primary-400 hover:underline'>
                                    Log in here
                                </a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export { Login }
