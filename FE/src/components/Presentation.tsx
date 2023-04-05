import React from "react"
import { RiCloseCircleFill } from "react-icons/ri"
import { ImCheckmark } from "react-icons/im"
import { BsTrash, BsFillPersonFill } from "react-icons/bs"
import moment from "moment"
import { userEndpoint } from "../lib/api"

interface PresentationProps {
    presentation_id: string
    start_time: number
    end_time: number
    presentation_duration: number
    break_time: number
}

const Presentation = ({
    presentation_id,
    start_time,
    end_time,
    break_time,
    presentation_duration,
}: PresentationProps) => {
    const [isClicked, setIsClicked] = React.useState(false)
    const handlePresentationDelete = async () => {
        try {
            await userEndpoint.delete("user/deletePresentation/")
            window.location.reload()
        } catch (err) {
            alert("something went wrong. Contact tochey@outlook.com")
        }
    }
    return (
        <div className='max-w-xs rounded-lg bg-black shadow-lg text-center border border-solid'>
            <img
                className='rounded-t-lg'
                src={`https://picsum.photos/seed/${presentation_id}/320/200/?blur=2`}
                width={320}
                height={200}
                alt=''
            />
            <div className='p-6'>
                <h5 className='mb-2 text-lg font-bold text-white'>
                    Active Presentation Schedule
                </h5>
                <p className='mb-4 text-md text-blue-600 font-bold'>
                    <span className='italic  text-white'>from: </span>
                    {moment(start_time).format("MMMM Do, h:mm a")}
                    <br />
                    <span className='italic  text-white'>to: </span>{" "}
                    {moment(end_time).format("MMMM Do, h:mm a")}
                    <br />
                </p>
                <p className='mb-4 text-md text-blue-600 font-bold'>
                    <span className='italic text-white'>
                        Presentation Duration:{" "}
                    </span>
                    {presentation_duration} minutes
                    <br />
                    <span className='italic text-white'>Break Time: </span>
                    {break_time} minutes
                    <br />
                </p>
                <>
                    <ul className='flex items-center gap-10 '>
                        {isClicked ? (
                            <li className='flex gap-10'>
                                <RiCloseCircleFill
                                    className=' h-6 w-6 text-blue-600 hover:text-white'
                                    onClick={() => setIsClicked(!isClicked)}
                                />
                                <ImCheckmark
                                    className=' h-6 w-6 text-blue-600 hover:text-white'
                                    onClick={handlePresentationDelete}
                                />
                            </li>
                        ) : (
                            <li>
                                <BsTrash
                                    className=' h-6 w-6 text-blue-600 hover:text-white'
                                    onClick={() => setIsClicked(!isClicked)}
                                />
                            </li>
                        )}

                        <li className=' flex font-bold'>
                            <BsFillPersonFill className='h-6 w-6 text-blue-600 hover:text-white' />
                            {/* <span className='text-lg'>{numOfStudents}</span> */}
                        </li>
                    </ul>
                </>
            </div>
        </div>
    )
}

export default Presentation
