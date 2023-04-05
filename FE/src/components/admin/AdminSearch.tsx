import React from "react"
// to lazy
const AdminSearch = ({ sq }: any) => {
    return (
        <>
            <label
                htmlFor='default-search'
                className='mb-2 text-sm font-medium sr-only text-white'>
                Search
            </label>
            <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none '>
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
                    className='block w-1/3 p-4 pl-10 text-md border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none'
                    placeholder='Search for Students'
                    required
                    onChange={(e) => sq(e.target.value.toLowerCase())}
                />
            </div>
        </>
    )
}

export default AdminSearch
