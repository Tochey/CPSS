import { Link, useNavigate } from "react-router-dom"
import { iamEndpoint } from "../lib/api"
import { useEffect, useState } from "react"
import { useAuth } from "../lib/AuthContext"
import AnimatedSpinner from "./AnimatedSpinner"

function LandingPage() {
    const [accessToken, setAccessToken] = useState<string | string>("")
    const [error, setError] = useState<string | string>("")
    const [isLoading, setIsLoading] = useState<boolean | boolean>(false)
    const navigate = useNavigate()

    const handleSubmit = async () => {
        setError("")
        setIsLoading(true)

        const data = {
            accessToken,
        }

        try {
            await iamEndpoint.post("/iam/signup", data)
            navigate("/login")
        } catch (error: any) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data)
            }
        }

        setIsLoading(false)
    }

    return (
        <div className='flex justify-center items-center mt-20'>
            <div className='p-8 rounded shadow-md flex flex-col justify-center items-center container gap-4 '>
                <h1 className='font-extrabold text-transparent text-7xl bg-clip-text bg-gradient-to-r from-primary to-pink-600'>
                    Capstone Submission System.
                </h1>
                <p className='text-gray-400 text-center pt-1 text-xl w-1/2'>
                    Unlock valuable insights and inspiration for your own
                    capstone project by accessing and referencing previous
                    submissions from your peers. Sign up now to start exploring!
                </p>
                <div className='my-4 w-full max-w-md'>
                    <label
                        htmlFor='access-token'
                        className='block text-gray-400 font-bold mb-2'>
                        Access Token
                    </label>
                    <input
                        id='access-token'
                        name='access-token'
                        type='password'
                        className='shadow appearance-none border rounded w-full p-3 text-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400 '
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
                {isLoading && <AnimatedSpinner />}
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
