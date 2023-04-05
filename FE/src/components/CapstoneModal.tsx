import React from "react"

//too lazy
const CapstoneModal = ({ sm, handleSignup }: any) => {
    const [data, setData] = React.useState({
        capstone_title: "",
        capstone_abstract: "",
    })

    const handleChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }
    return (
        <div
            className='relative z-10'
            aria-labelledby='modal-title'
            role='dialog'
            aria-modal='true'>
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'></div>

            <div className='fixed inset-0 z-10 overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                    <div className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                        <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                            <div className='sm:flex sm:items-start'>
                                <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                                    <svg
                                        className='h-6 w-6 text-red-600'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke-width='1.5'
                                        stroke='currentColor'
                                        aria-hidden='true'>
                                        <path
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                            d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
                                        />
                                    </svg>
                                </div>
                                <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                                    <h3
                                        className='text-base font-semibold leading-6 text-gray-900'
                                        id='modal-title'>
                                        Provide Capstone Title and Abstract
                                    </h3>
                                    <form className='w-full max-w-lg'>
                                        <div className='flex flex-wrap -mx-3 mb-6 mt-6'>
                                            <div className='w-full px-3'>
                                                <label
                                                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                                                    htmlFor='capstone_title'>
                                                    Capstone Title
                                                </label>
                                                <input
                                                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                                                    type='text'
                                                    placeholder='Build a spaceship'
                                                    name='capstone_title'
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </div>
                                            <div className='w-full px-3'>
                                                <label
                                                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                                                    htmlFor='capstone_title'>
                                                    Capstone Abstract
                                                </label>
                                                <textarea
                                                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 resize-none h-48'
                                                    spellCheck
                                                    datatype='string'
                                                    name='capstone_abstract'
                                                    onChange={(e) => handleChange(e)}
                                                />
                                                <p className='text-gray-600 text-xs italic'>
                                                    Make it as long and as crazy
                                                    as you'd like
                                                </p>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                            <button
                                type='button'
                                className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto'
                                onClick={() => handleSignup(data.capstone_title, data.capstone_abstract)}>
                                Sign up
                            </button>
                            <button
                                type='button'
                                className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                                onClick={() => sm(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CapstoneModal
