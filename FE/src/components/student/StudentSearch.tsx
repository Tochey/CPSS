import React, { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

const StudentSearch = () => {
    const [data, setData] = React.useState({
        search: "",
    })

    const navigate = useNavigate()

    const handleChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleClick: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => void = (e) => {
        e.preventDefault()
        navigate(`/hits?q=${data.search}`)
    }

    return (
        <>
            <label
                htmlFor='default-search'
                className='mb-2 text-sm font-medium  sr-only text-white'>
                Search
            </label>
            <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <svg
                        aria-hidden='true'
                        className='w-5 h-5 text-gray-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='2'
                            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
                    </svg>
                </div>
                <input
                    type='search'
                    id='default-search'
                    className='block w-full p-4 pl-10   border  rounded-lg  focus:ring-blue-500  bg-gray-700 border-gray-600 placeholder-gray-400 text-white  outline-none text-lg'
                    placeholder='Search Past Projects..'
                    required
                    onChange={handleChange}
                    name='search'
                />
                <button
                    type='submit'
                    className='text-white absolute right-3.5 bottom-3.5 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800'
                    onClick={handleClick}>
                    Search
                </button>
            </div>
        </>
    )
}

export default StudentSearch
