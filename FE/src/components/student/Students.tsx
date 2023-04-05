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
}
//  const q = [
//     {
//         ROLE: "STUDENT",
//         createdAt: "2022-03-31T18:15:00.000Z",
//         is_520_student: true,
//         is_graduated: false,
//         email: "jane.doe@example.com",
//         name: "Jane Doe",
//         updatedAt: "2022-03-31T18:15:00.000Z",
//         userId: "e7c22a45-55a2-4f70-af24-5a2b33d1f940",
//     },
//     {
//         ROLE: "STUDENT",
//         createdAt: "2022-03-31T18:20:00.000Z",
//         is_520_student: false,
//         is_graduated: true,
//         email: "john.smith@example.com",
//         name: "John Smith",
//         updatedAt: "2022-03-31T18:20:00.000Z",
//         userId: "f8d33b67-77c2-4e81-ba1d-8c9e44f2f06e",
//     },
//     {
//         ROLE: "STUDENT",
//         createdAt: "2022-03-31T18:25:00.000Z",
//         is_520_student: true,
//         is_graduated: false,
//         email: "jessica.nguyen@example.com",
//         name: "Jessica Nguyen",
//         updatedAt: "2022-03-31T18:25:00.000Z",
//         userId: "d9e44c89-88d2-4d71-9e3f-3b2a11e4d8b6",
//     },
//     {
//         ROLE: "STUDENT",
//         createdAt: "2022-03-31T18:15:00.000Z",
//         is_520_student: true,
//         is_graduated: false,
//         email: "jane.doe@example.com",
//         name: "Jane Doe",
//         updatedAt: "2022-03-31T18:15:00.000Z",
//         userId: "e7c22a45-55a2-4f70-af24-5a2b33d1f940",
//     },
//     {
//         ROLE: "STUDENT",
//         createdAt: "2022-03-31T18:20:00.000Z",
//         is_520_student: false,
//         is_graduated: true,
//         email: "john.smith@example.com",
//         name: "John Smith",
//         updatedAt: "2022-03-31T18:20:00.000Z",
//         userId: "f8d33b67-77c2-4e81-ba1d-8c9e44f2f06e",
//     },
//     {
//         ROLE: "STUDENT",
//         createdAt: "2022-03-31T18:25:00.000Z",
//         is_520_student: true,
//         is_graduated: false,
//         email: "jessica.nguyen@example.com",
//         name: "Jessica Nguyen",
//         updatedAt: "2022-03-31T18:25:00.000Z",
//         userId: "d9e44c89-88d2-4d71-9e3f-3b2a11e4d8b6",
//     },
//     {
//         ROLE: "STUDENT",
//         createdAt: "2022-03-31T18:30:00.000Z",
//         is_520_student: true,
//         is_graduated: false,
//         email: "peter.lee@example.com",
//         name: "Peter Lee",
//         updatedAt: "2022-03-31T18:30:00.000Z",
//         userId: "c8b99a43-33e3-4f09-8d3d-1e2f22c5a7df",
//     },
//     {
//         ROLE: "STUDENT",
//         createdAt: "2022-03-31T18:35:00.000Z",
//         is_520_student: true,
//         is_graduated: false,
//         email: "amy.wang@example.com",
//         name: "Amy Wang",
//         updatedAt: "2022-03-31T18:35:00.000Z",
//         userId: "b7a88b65-44d4-4e77-aabb-0d1c33e7f8ef",
//     },
//     {
//         ROLE: "STUDENT",
//         createdAt: "2022-03-31T18:40:00.000Z",
//         is_520_student: false,
//         is_graduated: true,
//         email: "michael.kim@example.com",
//         name: "Michael Kim",
//         updatedAt: "2022-03-31T18:40:00.000Z",
//         userId: "a6b77c87-55e5-4d88-bb99-2c3d",
//     },
//     {
//         ROLE: "STUDENT",
//         createdAt: "2022-03-28T10:05:00Z",
//         is_520_student: true,
//         is_graduated: false,
//         email: "jane.doe@example.com",
//         name: "Jane Doe",
//         updatedAt: "2022-04-01T08:20:00Z",
//         userId: "0123456789",
//     },
//     {
//         ROLE: "STUDENT",
//         createdAt: "2022-02-15T13:45:00Z",
//         is_520_student: true,
//         is_graduated: false,
//         email: "john.doe@example.com",
//         name: "John Doe",
//         updatedAt: "2022-04-01T08:20:00Z",
//         userId: "9876543210",
//     },
//     {
//         ROLE: "STUDENT",
//         createdAt: "2022-01-02T09:30:00Z",
//         is_520_student: false,
//         is_graduated: true,
//         email: "mary.smith@example.com",
//         name: "Mary Smith",
//         updatedAt: "2022-04-01T08:20:00Z",
//         userId: "1357902468",
//     },
//     {
//         ROLE: "STUDENT",
//         createdAt: "2021-12-05T16:15:00Z",
//         is_520_student: false,
//         is_graduated: true,
//         email: "bob.johnson@example.com",
//         name: "Bob Johnson",
//         updatedAt: "2022-04-01T08:20:00Z",
//         userId: "2468013579",
//     },
//     {
//         ROLE: "STUDENT",
//         createdAt: "2021-11-11T11:11:00Z",
//         is_520_student: true,
//         is_graduated: false,
//         email: "jennifer.lee@example.com",
//         name: "Jennifer Lee",
//         updatedAt: "2022-04-01T08:20:00Z",
//         userId: "3698521470",
//     },
// ]

const Students = () => {
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
                    res.data.filter((s: any) => s.is_graduated === false)
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
            <p className='font-bold p-4 text-center text-lg text-blue-600'>
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

export default Students
