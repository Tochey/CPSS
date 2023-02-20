import { Link } from "react-router-dom"
import api from "../lib/api"
import { useState } from "react"

function LandingPage() {
    const [accessToken, setAccessToken] = useState<string | string>("")
    const [error, setError] = useState<string | string>("")

    const handleSubmit = async () => {
        setError("")
        const data = {
            accessToken,
        }

        try {
            await api.post("/iam/signup", data)
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
        <div className='h-screen flex justify-center items-center bg-black'>
            <div className='p-8 rounded shadow-md flex flex-col justify-center items-center'>
                <h1 className='font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-primary to-pink-600'>
                    Capstone Submission System
                </h1>
                <p className='text-gray-400 text-center pt-1'>
                    Store and reference previous capstone projects of your peers
                </p>
                <div className='my-6 w-full max-w-md'>
                    <label
                        htmlFor='access-token'
                        className='block text-gray-400 font-bold mb-2'>
                        Access Token
                    </label>
                    <input
                        id='access-token'
                        name='access-token'
                        type='password'
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline '
                        placeholder='Enter your canvas access token'
                        onChange={(e) => setAccessToken(e.target.value)}
                        required
                    />
                    {error && (
                        <p className='pt-4 text-md font-bold italic  text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600'>
                            {error}
                        </p>
                    )}
                </div>
                <button
                    className=' text-gray-400 font-bold py-2 px-4 rounded border border-solid border-gray-400 hover:border-pink-600'
                    onClick={handleSubmit}>
                    Sign up
                </button>
                <p className='text-gray-400 pt-4 font-bold'>
                    Already have an account?{" "}
                    <span className='font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600'>
                        <Link to='/login'>Login</Link>
                    </span>
                </p>
            </div>
        </div>
    )
}

export { LandingPage }
