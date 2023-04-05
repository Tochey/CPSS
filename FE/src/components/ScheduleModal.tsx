import React, { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { userEndpoint } from "../lib/api"

//to lazy
const ScheduleModal = ({ setIsOpen }: any) => {
    const [startDateTime, setStartDateTime] = useState<Date>(new Date())
    const [endDateTime, setEndDateTime] = useState<Date>(new Date())
    const [data, setData] = useState({
        presentation_duration: 0,
        break_time: 0,
    })

    const handleStudentChange: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value })
    }

    const handleCalendarClose = () => console.log("Calendar closed")
    const handleCalendarOpen = () => console.log("Calendar opened")
    let handleColor = (time: { getHours: () => number }) => {
        return time.getHours() > 12 ? "text-success" : "text-error"
    }

    const handleSubmit = async () => {
        if (startDateTime >= endDateTime) {
            alert("Start time must be before end time")
            return
        }

        if (data.presentation_duration <= 0) {
            alert("Duration and break time must be greater than 0")
            return
        }

        const req = {
            start_time: startDateTime,
            end_time: endDateTime,
            ...data,
        }

        try {
            await userEndpoint.post("user/createPresentation", req)
        } catch (error) {
            alert("Error creating presentation schedule")
        }

        setIsOpen(false)
        window.location.reload()
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
                                <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10'>
                                    <svg
                                        className='h-6 w-6 text-blue-600'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth='1.5'
                                        stroke='currentColor'
                                        aria-hidden='true'>
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
                                        />
                                    </svg>
                                </div>
                                <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                                    <h3
                                        className='text-base font-semibold leading-6 text-gray-900'
                                        id='modal-title'>
                                        Create Presentation Schedule
                                    </h3>
                                    <form className='w-full max-w-lg mt-5 '>
                                        <div className='flex flex-wrap -mx-3 mb-6'>
                                            <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                                                <label
                                                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                                                    htmlFor='start_time'>
                                                    Start Time
                                                </label>
                                                <DatePicker
                                                    selected={startDateTime}
                                                    onChange={(date) =>
                                                        setStartDateTime(date!)
                                                    }
                                                    onCalendarClose={
                                                        handleCalendarClose
                                                    }
                                                    onCalendarOpen={
                                                        handleCalendarOpen
                                                    }
                                                    showTimeSelect
                                                    timeClassName={handleColor}
                                                    timeIntervals={30}
                                                    timeCaption='Time'
                                                    dateFormat='MMMM d, h:mm aa'
                                                    minDate={new Date()}
                                                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-blue-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white cursor-pointer caret-transparent'
                                                />
                                            </div>
                                            <div className='w-full md:w-1/2 px-3 mb-6 md:mb-0'>
                                                <label
                                                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                                                    htmlFor='end_time'>
                                                    End Time
                                                </label>
                                                <DatePicker
                                                    selected={endDateTime}
                                                    onChange={(date) =>
                                                        setEndDateTime(date!)
                                                    }
                                                    onCalendarClose={
                                                        handleCalendarClose
                                                    }
                                                    onCalendarOpen={
                                                        handleCalendarOpen
                                                    }
                                                    showTimeSelect
                                                    timeClassName={handleColor}
                                                    timeIntervals={30}
                                                    timeCaption='Time'
                                                    dateFormat='MMMM d, h:mm aa'
                                                    minDate={new Date()}
                                                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-blue-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white cursor-pointer caret-transparent'
                                                />
                                            </div>
                                            <div className='w-full md:w-1/2 px-3'>
                                                <label
                                                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                                                    htmlFor='presentation_duration'>
                                                    Duration (in mins)
                                                </label>
                                                <input
                                                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                                                    name='presentation_duration'
                                                    type='number'
                                                    onChange={(e) =>
                                                        handleStudentChange(e)
                                                    }
                                                    placeholder='0'
                                                />
                                            </div>
                                            <div className='w-full md:w-1/2 px-3'>
                                                <label
                                                    className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                                                    htmlFor='break_time'>
                                                    Break (in mins)
                                                </label>
                                                <input
                                                    className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
                                                    name='break_time'
                                                    type='number'
                                                    onChange={(e) =>
                                                        handleStudentChange(e)
                                                    }
                                                    placeholder='0'
                                                />
                                            </div>
                                        </div>
                                        <p className='text-sm text-gray-500 font-bold italic'>
                                            Once upon a time, there was a
                                            penguin who decided to take a trip
                                            to the Bahamas. As he arrived on the
                                            beautiful sandy beach, he realized
                                            he forgot his sunglasses. So, he
                                            waddled over to a nearby convenience
                                            store and bought the biggest pair he
                                            could find. But alas, they were too
                                            big, and he tripped and stumbled
                                            into a nearby ice cream stand,
                                            causing chaos and laughs for
                                            everyone around.
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                            <button
                                type='button'
                                className='inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto'
                                onClick={handleSubmit}>
                                Create
                            </button>
                            <button
                                type='button'
                                className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                                onClick={() => setIsOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScheduleModal
