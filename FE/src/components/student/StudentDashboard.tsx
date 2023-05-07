import { useEffect, useState } from "react"
import PresentationAlertToast from "../PresentationAlertToast"
import StudentSearch from "./StudentSearch"
import { userEndpoint } from "../../lib/api"
import { useAuth } from "../../lib/AuthContext"
import TimeSlotPill from "../TimeSlotPill"
import moment from "moment"
import { BsTrash } from "react-icons/bs"
import { RiCloseCircleFill } from "react-icons/ri"
import { ImCheckmark } from "react-icons/im"
import CapstoneModal from "../CapstoneModal"
import AnimatedSpinner from "../AnimatedSpinner"

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
    has_uploaded_520_capstone: boolean
}

interface PresentationProps {
    presentation_id: string
    start_time: number
    end_time: number
    presentation_duration: number
    break_time: number
}

interface TimeSlotProps {
    time_slot_id: string
    start_time: number
    end_time: number
    is_available: boolean
    registered_student_id: number
}

interface RegistrationProps {
    registration_id: string
    student_id: string
    time_slot_id: string
    registration_timestamp: number
    capstone_title: string
    capstone_abstract: string
}

const StudentDashboard = () => {
    const [presentation, setPresentation] = useState<PresentationProps[]>([])
    const [userData, setUserData] = useState<Student | null>(null)
    const [timeSlots, setTimeSlots] = useState<TimeSlotProps[]>([])
    const [selectedTimeSlot, setSelectedTimeSlot] =
        useState<TimeSlotProps | null>(null)
    const { getUser } = useAuth()
    const [registration, setRegistration] = useState<
        RegistrationProps[] | null
    >([])

    const [registeredTimeSlot, setRegisteredTimeSlot] =
        useState<TimeSlotProps | null>(null)

    const [isClicked, setIsClicked] = useState(false)
    const [modalIsShown, setModalIsShown] = useState(false)

    useEffect(() => {
        userEndpoint.get(`/user/getStudent/${getUser()!.id}`).then((res) => {
            setUserData(res.data)
            if (res.data.is_520_student) {
                const cn = "CSC520"
                userEndpoint.get(`/user/getTimeSlots/${cn}`).then((res) => {
                    setTimeSlots(res.data)
                })
                userEndpoint.get(`/user/getPresentation/${cn}`).then((res) => {
                    setPresentation(res.data)
                })
            } else {
                const cn = "CSC521"
                userEndpoint.get(`/user/getTimeSlots/${cn}`).then((res) => {
                    setTimeSlots(res.data)
                })
                userEndpoint.get(`/user/getPresentation/${cn}`).then((res) => {
                    setPresentation(res.data)
                })
            }
        })

        userEndpoint
            .get(`/user/getRegistration/${getUser()!.id}`)
            .then((res) => {
                setRegistration(res.data)
            })
    }, [])

    useEffect(() => {
        if (registration && registration.length > 0) {
            console.log(registration[0])
            userEndpoint
                .get(`/user/getTimeSlot/${registration[0].time_slot_id}`)
                .then((res) => {
                    console.log(res.data)
                    setRegisteredTimeSlot(res.data)
                })
        }
    }, [registration])

    const handleTimeSlotDelete = () => {
        userEndpoint
            .delete(
                `/user/deleteRegistration/${
                    registration && registration[0].student_id
                }`
            )
            .then((res) => {
                window.location.reload()
            })
    }

    const handleSubmit = () => {
        if (!selectedTimeSlot) {
            alert("Please select a time slot")
            return
        }

        setModalIsShown(true)
    }

    const handleTimeSlotSignUp = (ct: string, ca: string) => {
        if (!selectedTimeSlot) {
            alert("Please select a time slot")
            return
        }

        ca = ca.trim().replace(/\s+/g, " ")
        ct = ct.trim().replace(/\s+/g, " ")
        const words = ca.split(" ")

        const wordCount = words.length

        if (wordCount < 50 || wordCount > 150) {
            alert(
                "Capstone abstract must be at least 50 words and no more than 150 words"
            )
            return
        }

        try {
            userEndpoint
                .post("user/registerTimeSlot", {
                    time_slot_id: selectedTimeSlot.time_slot_id,
                    student_id: userData!.userId,
                    capstone_title: ct,
                    capstone_abstract: ca,
                    className: userData!.is_520_student ? "CSC520" : "CSC521",
                })
                .then((res) => {
                    window.location.reload()
                })
        } catch {
            alert("Error in registering for presentation")
        }
    }

    return (
        <>
            {presentation.length > 0 &&
                registration &&
                registration.length === 0 && <PresentationAlertToast />}
            <div className='container mx-auto px-60'>
                <StudentSearch />
            </div>
            <div className='container mx-auto mt-10'>
                {presentation.length > 0 && (
                    <div className='block max-w-md p-6 border rounded-lg shadow bg-gray-800 border-gray-700 hover:bg-gray-700'>
                        <h1 className='text-xl text-blue-600'>
                            Presentation Date:{" "}
                            <span className='text-white font-bold'>
                                {moment(presentation[0].start_time).format(
                                    "MMMM Do, h:mm a"
                                )}
                            </span>
                        </h1>
                        {registration && registration.length > 0 && (
                            <>
                                <h1 className='text-xl text-blue-600'>
                                    Registered Time Slot:{" "}
                                    <span className='text-white font-bold'>
                                        {moment(
                                            registeredTimeSlot?.start_time
                                        ).format("h:mm a")}{" "}
                                        -{" "}
                                        {moment(
                                            registeredTimeSlot?.end_time
                                        ).format("h:mm a")}
                                    </span>
                                </h1>
                                <h1 className='text-xl text-blue-600'>
                                    Capstone Title:{" "}
                                    <span className='text-white font-bold'>
                                        {registration[0].capstone_title}
                                    </span>
                                </h1>
                                <ul className='flex items-center gap-10  mt-5'>
                                    {isClicked ? (
                                        <li className='flex gap-10'>
                                            <RiCloseCircleFill
                                                className=' h-6 w-6 text-white'
                                                onClick={() =>
                                                    setIsClicked(!isClicked)
                                                }
                                            />
                                            <ImCheckmark
                                                className=' h-6 w-6 text-red-600'
                                                onClick={handleTimeSlotDelete}
                                            />
                                        </li>
                                    ) : (
                                        <li>
                                            <BsTrash
                                                className=' h-6 w-6 text-red-600 '
                                                onClick={() =>
                                                    setIsClicked(!isClicked)
                                                }
                                            />
                                        </li>
                                    )}
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </div>
            {presentation.length > 0 &&
                registration &&
                registration.length === 0 && (
                    <div className='container mx-auto p-2'>
                        <div className='flex flex-wrap -mx-2 mt-10 justify-center'>
                            {timeSlots
                                .filter(({ is_available }) => is_available)
                                .map(
                                    (
                                        {
                                            start_time,
                                            end_time,
                                            is_available,
                                            registered_student_id,
                                            time_slot_id,
                                        },
                                        idx
                                    ) => (
                                        <TimeSlotPill
                                            start_time={start_time}
                                            end_time={end_time}
                                            is_available={is_available}
                                            registered_student_id={
                                                registered_student_id
                                            }
                                            time_slot_id={time_slot_id}
                                            key={idx}
                                            setSelectedTimeSlot={
                                                setSelectedTimeSlot
                                            }
                                        />
                                    )
                                )}
                        </div>
                        <div className='flex justify-end p-5'>
                            <button
                                className='bg-blue-600 text-white py-1 px-4 rounded-sm outline-none border-2 border-transparent  transition duration-200 ease-in font-bold hover:bg-blue-800'
                                onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                        {modalIsShown && (
                            <CapstoneModal
                                sm={setModalIsShown}
                                handleSignup={handleTimeSlotSignUp}
                            />
                        )}
                    </div>
                )}
        </>
    )
}

export { StudentDashboard }
