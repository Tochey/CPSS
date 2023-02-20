import { useState } from "react"
import { Navbar } from "./components/Navbar"

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Navbar />
            <div className='h-screen flex justify-center items-center bg-black'>
                <div className='p-8 rounded shadow-md flex flex-col justify-center items-center'>
                    <img src={""} className='w-24 h-24' alt='logo' />
                    <h1 className='font-extrabold text-transparent text-6xl bg-clip-text bg-gradient-to-r from-primary to-pink-600'>
                        Capstone Submission System
                    </h1>
                    <p className='text-gray-400 text-center pt-1'>
                        Store and reference previous capstone projects of your
                        peers
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
                            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                            placeholder='Enter your canvas access token'
                        />
                    </div>
                    <button className=' text-white font-bold py-2 px-4 rounded border border-solid hover:border-pink-600'>
                        Sign up
                    </button>
                    <p className=' text-gray-400 pt-4 font-bold'>
                        Already have an account?{" "}
                        <span className='font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-600'>
                            <a href='#'>Login</a>
                        </span>
                    </p>
                </div>
            </div>
        </>
    )
}

export default App
