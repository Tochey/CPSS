import React, { useEffect, useState } from "react"
import { userEndpoint } from "../../lib/api"
import { useAuth } from "../../lib/AuthContext"
import StudentProfile from "./StudentProfile"
import AdminSearch from "../admin/AdminSearch"

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
const Students521 = () => {
    const [students, setStudents] = useState<Array<Student>>([])
    const [searchQuery, setSearchQuery] = useState("")

    const filteredStudents = students.filter((student) => {
        return student.name.toLowerCase().includes(searchQuery.toLowerCase())
    })

    useEffect(() => {
        userEndpoint
            .get("user/getAllStudents")
            .then((res) => {
                setStudents(
                    res.data.filter((s: any) => !s.is_graduated  && !s.is_520_student)
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
                521 Students
            </h1>
            <p className='font-bold p-4 text-center text-lg  text-red-600'>
                Note: Capstone Documents are available to download ONLY if you
                have RECENTLY done a sync
            </p>
            <div className='container mx-auto '>
                <div className=' flex flex-wrap'>
                    {filteredStudents.map((s, idx) => (
                        <div className='w-1/4 mt-5 ' key={idx}>
                            <StudentProfile key={idx} student={s} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Students521
