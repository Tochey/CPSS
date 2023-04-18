import React, { useEffect, useState } from "react"
import { userEndpoint } from "../../lib/api"
import AdminSearch from "../admin/AdminSearch"
import StudentProfile from "./StudentProfile"
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

const StudentArchive = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [students, setStudents] = useState<Array<Student>>([])

    const filteredStudents = students.filter((student) => {
        return student.name.toLowerCase().includes(searchQuery.toLowerCase())
    })

    useEffect(() => {
        userEndpoint
            .get("user/getAllStudents")
            .then((res) => {
                setStudents(
                    res.data.filter((s: any) => s.is_graduated === true)
                )
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    return (
        <>
            {students.length > 0 ? (
                <>
                    <div className='container mx-auto px-4 py-4 items-center justify-center '>
                        <AdminSearch sq={setSearchQuery} />
                    </div>
                    <div className='container mx-auto'>
                        <div className=' flex flex-wrap'>
                            {filteredStudents.map((s, idx) => (
                                <div className='w-1/4 mt-5' key={idx}>
                                    <StudentProfile key={idx} student={s} />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div className='container mx-auto'>
                    <h3 className='text-blue-500 font-bold text-lg'>
                        No Archived Students
                    </h3>
                </div>
            )}
        </>
    )
}

export default StudentArchive
