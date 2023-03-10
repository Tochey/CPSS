import { useState } from "react"
import axios from "axios"

export default function Signup() {
    const [accessToken, setAccessToken] = useState<string | string>("")
    const [error, setError] = useState<string | string>("")

    const handleSubmit = async () => {
        const data = {
            accessToken,
        }

        try {
            await axios.post("http://localhost:8080/iam/signup", data)
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
        <div>
            <h1 className='px-4 text-green-500 font-bold'>Signup</h1>
            <form className='px-4'>
                <div className='mb-4'>
                    <label
                        className='block mb-2 text-sm font-bold text-gray-700'
                        htmlFor='accessToken'>
                        Access Token
                    </label>
                    <input
                        className='w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                        id='accessToken'
                        type='text'
                        placeholder='Enter your access token'
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                    />
                </div>
                <div className='mb-6 text-center'>
                    <button
                        className='w-full px-4 py-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-700 focus:outline-none focus:shadow-outline'
                        type='button'
                        onClick={handleSubmit}>
                        Signup
                    </button>
                    {error && (
                        <p className='mt-4 text-xs italic text-red-500'>
                            {error}
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}
