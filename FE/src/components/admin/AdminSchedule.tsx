import React, { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import ScheduleModal from "../ScheduleModal"
import { userEndpoint } from "../../lib/api"
import Presentation from "../Presentation"

interface PresentationProps {
    presentation_id: string
    start_time: number
    end_time: number
    presentation_duration: number
    break_time: number
    className: string
}
interface Student {
    ROLE: string
    createdAt: string
    is_520_student: boolean
    is_graduated: boolean
    email: string
    name: string
    updatedAt: string
    userId: string
    student_id: string
    has_uploaded_capstone: boolean
}

const AdminSchedule = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [presentation, setPresentation] = useState<Array<PresentationProps>>(
        []
    )

    const [registeredStudents, setRegiteredStudents] = useState<Array<Student>>(
        []
    )

    useEffect(() => {
        userEndpoint.get("user/getPresentationIfAny").then((res) => {
            setPresentation(res.data)
        })

        // userEndpoint.get("user/getAllRegistrations").then((res) => {
        //     userEndpoint
        //         .get(`/user/getStudent/${res.data[0].student_id}`)
        //         .then((res) => {
        //             setRegiteredStudents([...registeredStudents, res.data])
        //         })
        // })
    }, [])

    return (
        <>
            <div className='container mx-auto'>
                <button
                    onClick={() => setIsOpen(true)}
                    className='border border-solid rounded-md p-2 text-white font-bold text-sm hover:text-blue-500 mt-4 mb-4'>
                    Create Schedule
                </button>
                <div className='flex gap-20'>
                    {presentation.map((p) => {
                        return (
                            <Presentation
                                presentation_id={p.presentation_id}
                                start_time={p.start_time}
                                end_time={p.end_time}
                                presentation_duration={p.presentation_duration}
                                break_time={p.break_time}
                                className={p.className}
                            />
                        )
                    })}
                </div>
            </div>
            {/* {registeredStudents.length > 0 ? (
                <div className='container mx-auto flex flex-wrap'>
                    {registeredStudents.map((s) => {
                        return (
                            <>
                                <div className='w-1/4 mt-10'>
                                    <div className=' p-6 border rounded-lg shadow bg-gray-900 border-gray-700 w-72 '>
                                        <a>
                                            <h5 className='mb-1 text-lg font-semibold  text-gray-900 dark:text-white'>
                                                {s.name}
                                            </h5>
                                        </a>
                                    </div>
                                </div>
                            </>
                        )
                    })}
                </div>
            ) : null} */}
            {isOpen && <ScheduleModal setIsOpen={setIsOpen} />}
        </>
    )
}

export default AdminSchedule
