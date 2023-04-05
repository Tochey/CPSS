import React, { useState } from "react"
import moment from "moment"

interface TimeSlotProps {
    time_slot_id: string
    start_time: number
    end_time: number
    is_available: boolean
    registered_student_id: number
}

const TimeSlotPill = ({
    start_time,
    setSelectedTimeSlot,
    end_time,
    is_available,
    registered_student_id,
    time_slot_id,
}: TimeSlotProps & { setSelectedTimeSlot: any }) => {
    const [selected, setSelected] = useState(false)

    return (
        <div className='sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-2 mt-10'>
            <button
                className={`w-1/2 bg-gray-700 text-white py-2 px-4 rounded-full outline-none border-2 border-transparent transition duration-200 ease-in font-bold ${
                    selected ? "bg-red-700 border-red-700" : ""
                }`}
                onClick={() => {
                    setSelected(!selected)
                    setSelectedTimeSlot({
                        start_time,
                        end_time,
                        is_available,
                        registered_student_id,
                        time_slot_id,
                    })
                }}
                onBlur={() => setSelected(false)}>
                {moment(start_time).format("h:mm a")}
            </button>
        </div>
    )
}

export default TimeSlotPill
