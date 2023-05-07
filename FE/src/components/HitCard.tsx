import React, { useEffect, useState } from "react"
import { psEndpoint, userEndpoint } from "../lib/api"
import { MdFileDownload } from "react-icons/md"

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

const HitCard = ({ hits }) => {
    const [student, setStudent] = useState<Student | null>(null)
    const processText = (text: string) => {
        const words = text.split(" ")
        const truncated = words.slice(0, 75).join(" ")
        const ellipses = truncated + "..."
        return ellipses
    }

    useEffect(() => {
        userEndpoint
            .get(`/user/getStudent/${hits.meta_data.userid}`)
            .then((response) => {
                setStudent(response.data)
            })
    }, [])

    const get520Doc = async (student: Student) => {
        const fullName = student.name.toLowerCase().split(" ")
        const prefix = `${
            fullName[0].charAt(0) + fullName[1] + "_" + student.student_id + "/"
        }`
        const fileName = prefix + "520_FINAL_SUBMISSION.zip"
        await psEndpoint
            .post("/pre-signed", { Key: "capstone", fileName: fileName })
            .then((res) => {
                window.open(res.data.url)
            })
    }

    return (
        <div className='w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-10'>
            <svg
                className='w-10 h-10 mb-2 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                    fill-rule='evenodd'
                    d='M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z'
                    clip-rule='evenodd'></path>
                <path d='M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z'></path>
            </svg>

            <h5 className='mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white'>
                {hits.meta_data.name}
            </h5>

            <p className='mb-2 text-sm font-medium text-gray-600 dark:text-gray-400'>
                {hits.meta_data.email}
            </p>

            <p className='mb-3 font-normal text-gray-500 dark:text-gray-400'>
                {processText(hits.raw_text)}
            </p>
            {student && student.has_uploaded_520_capstone && (
                <a
                    className='inline-flex items-center text-blue-600 hover:underline cursor-pointer'
                    onClick={() => get520Doc(student)}>
                    Final 520 Doc <MdFileDownload />
                </a>
            )}
        </div>
    )
}

export default HitCard
