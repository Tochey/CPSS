import { GoAlert } from "react-icons/go"

const PresentationAlertToast = () => {
    return (
        <div className='flex justify-end p-5'>
            <div
                id='toast-success'
                className='flex items-center w-full max-w-xs p-4 mb-4  rounded-lg shadow text-gray-400 bg-gray-800'
                role='alert'>
                <div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8  rounded-lg bg-red-800 text-red-200'>
                    <GoAlert />
                    <span className='sr-only'>Check icon</span>
                </div>
                <div className='ml-2 text-md font-bold text-center'>
                    A new Presentation Schedule is available
                </div>
                <button
                    type='button'
                    className='ml-auto -mx-1.5 -my-1.5    rounded-lg  focus:ring-gray-300 p-1.5 inline-flex h-8 w-8 text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700'
                    data-dismiss-target='#toast-success'
                    aria-label='Close'>
                    <span className='sr-only'>Close</span>
                    <svg
                        aria-hidden='true'
                        className='w-5 h-5'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                            fill-rule='evenodd'
                            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                            clip-rule='evenodd'></path>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default PresentationAlertToast
