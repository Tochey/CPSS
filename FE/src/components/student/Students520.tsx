import React, { useEffect, useState } from "react"
import { userEndpoint } from "../../lib/api"
import { useAuth } from "../../lib/AuthContext"
import StudentProfile from "./StudentProfile"
import AdminSearch from "../admin/AdminSearch"
import moment from "moment"
import { BsHourglassSplit } from "react-icons/bs"

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

const handle520Sync = async () => {
    localStorage.setItem("timeOfLast520Sync", Date.now().toString())
    await userEndpoint
        .post("user/sync/520")
        .then((res) => {
            console.log(res.data)
            window.location.reload()
        })
        .catch((err) => {
            console.log(err)
        })
}

const Students520 = () => {
    const [students, setStudents] = useState<Array<Student>>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [lastSetTime, setLastSetTime] = useState<number | null>(null)

    const filteredStudents = students.filter((student) => {
        return student.name.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const shouldRenderButton = () => {
        if (!lastSetTime) return true

        const timeDifference = Date.now() - lastSetTime
        const hoursSinceLastSet = timeDifference / (1000 * 60 * 60)
        const minutesSinceLastSet = timeDifference / (1000 * 60)
        return hoursSinceLastSet >= 1 || minutesSinceLastSet >= 5
    }

    useEffect(() => {
        const storedTime = localStorage.getItem("timeOfLast520Sync")
        if (storedTime) {
            setLastSetTime(parseInt(storedTime))
        }
    }, [])

    useEffect(() => {
        userEndpoint
            .get("user/getAllStudents")
            .then((res) => {
                console.log(res.data)
                setStudents(
                    res.data.filter(
                        (s: Student) => !s.is_graduated && s.is_520_student
                    )
                )
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    return (
        <>
            <div className='container mx-auto px-4 py-4 items-center justify-center '>
                <AdminSearch sq={setSearchQuery} />
            </div>
            <h1 className='font-bold p-4 text-center text-2xl text-blue-600'>
                520 Students
            </h1>
            <p className='font-bold p-4 text-center text-lg text-red-600'>
                Note: 520 Documents are available to download ONLY if you have
                RECENTLY done a sync
            </p>
            <div className='container mx-auto '>
                {shouldRenderButton() ? (
                    <button
                        type='submit'
                        className='text-gray-400 font-bold py-2 px-4 rounded border border-solid border-gray-400 hover:border-pink-600'
                        onClick={handle520Sync}>
                        Sync
                    </button>
                ) : (
                    lastSetTime && (
                        <p className='text-white'>
                            Next sync in available in{" "}
                            <span className='text-blue-500 font-bold'>
                                {moment
                                    .duration(lastSetTime + 300000 - Date.now())
                                    .humanize()}
                                <BsHourglassSplit className='inline-block w-5 h-5' />{" "}
                            </span>
                        </p>
                    )
                )}
                <div className=' flex flex-wrap'>
                    {filteredStudents.map((s, idx) => (
                        <div className='w-1/4 mt-5 ' key={idx}>
                            <StudentProfile
                                key={idx}
                                student={s}
                                setStudent={setStudents}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Students520
