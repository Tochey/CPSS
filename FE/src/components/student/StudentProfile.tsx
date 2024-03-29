import React, { useState } from "react"
import "react-toggle/style.css"
import Toogle from "react-toggle"
import { psEndpoint, userEndpoint } from "../../lib/api"
import { BsTrash } from "react-icons/bs"
import { RiCloseCircleFill } from "react-icons/ri"
import { ImCheckmark } from "react-icons/im"
import { MdFileDownload } from "react-icons/md"
import { MdOutlineSettingsBackupRestore } from "react-icons/md"

interface IProps {
    student: {
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
    setStudent: any
}

const StudentProfile = ({ student, setStudent }: IProps) => {
    const [isClicked, setIsClicked] = useState(false)

    const getIndexDoc = async () => {
        const fullName = student.name.toLowerCase().split(" ")
        const prefix = `${
            fullName[0].charAt(0) + fullName[1] + "_" + student.student_id + "/"
        }`
        const fileName = prefix + "cpss_index.txt"
        await psEndpoint
            .post("/pre-signed", { Key: "index", fileName: fileName })
            .then((res) => {
                window.open(res.data.url)
            })
    }

    const get520Doc = async () => {
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
    const handleChange = async () => {
        const { is_520_student, userId } = student
        await userEndpoint
            .post(`/user/updateStudent/${userId}`, {
                is_520_student: !is_520_student,
            })
            .then((res) => {})
            .catch((err) => {
                alert("Something went wrong :(")
            })
        setStudent((prev: any) => {
            return prev.filter((s: any) => s.userId !== userId)
        })
    }

    const handleStudentArchive = async () => {
        const { is_graduated, userId } = student
        await userEndpoint
            .post(`/user/updateStudent/${userId}`, {
                is_graduated: !is_graduated,
            })
            .then((res) => {})
            .catch((err) => {
                alert("Something went wrong :(")
            })

        setStudent((prev: any) => {
            return prev.filter((s: any) => s.userId !== userId)
        })

        // window.location.reload()
    }

    return (
        <div className=' p-6 border rounded-lg shadow bg-gray-900 border-gray-700 w-72 '>
            <a>
                <h5 className='mb-1 text-lg font-semibold  text-white '>
                    {student.name}
                </h5>
            </a>
            <p className='mb-2  text-gray-400 font-bold'>
                {student.is_520_student ? "520 Student" : "521 Student"}
            </p>
            <div>
                <Toogle
                    defaultChecked={!student.is_520_student}
                    name='div'
                    onChange={handleChange}
                />
            </div>
            <div className='flex gap-5 mt-3 justify-evenly'>
                <a
                    className='inline-flex items-center text-blue-600 hover:underline cursor-pointer'
                    onClick={getIndexDoc}>
                    Index <MdFileDownload />
                </a>

                {student.has_uploaded_capstone && !student.is_520_student && (
                    <a className='inline-flex items-center text-blue-600 hover:underline cursor-pointer'>
                        Capstone <MdFileDownload />
                    </a>
                )}

                {student.has_uploaded_520_capstone &&
                    student.is_520_student && (
                        <a
                            className='inline-flex items-center text-blue-600 hover:underline cursor-pointer'
                            onClick={get520Doc}>
                            520 <MdFileDownload />
                        </a>
                    )}

                {isClicked ? (
                    <>
                        <div className='flex gap-5'>
                            <RiCloseCircleFill
                                className=' h-6 w-6 text-white'
                                onClick={() => setIsClicked(!isClicked)}
                            />
                            <ImCheckmark
                                className=' h-6 w-6 text-white'
                                onClick={(e) => handleStudentArchive()}
                            />
                        </div>
                    </>
                ) : student.is_graduated ? (
                    <MdOutlineSettingsBackupRestore
                        className=' h-6 w-6 text-white'
                        onClick={() => setIsClicked(!isClicked)}
                    />
                ) : (
                    <BsTrash
                        className=' h-6 w-6 text-white'
                        onClick={() => setIsClicked(!isClicked)}
                    />
                )}
            </div>
        </div>
    )
}

export default StudentProfile
