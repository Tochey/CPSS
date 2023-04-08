import dynamoosee from "dynamoose"
import { Item } from "dynamoose/dist/Item"

if (process.env.NODE_ENV !== "production") { dynamoosee.aws.ddb.local() }


interface User extends Item {
    userId: string
    email: string
    name: string
    ROLE: "STUDENT" | "ADMIN"
    currClass: string
    is_520_student: boolean
    is_graduated: boolean
    student_id: string //ssu's student id
    has_uploaded_capstone: boolean
}

const userSchema = new dynamoosee.Schema(
    {
        userId: {
            type: String,
            required: true,
            hashKey: true
        },
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        ROLE: {
            type: String,
            required: true,
            default: "STUDENT",
            index: {
                name: "ROLE-index",
            }
        },
        is_520_student: {
            type: Boolean,
            required: true,
            default: true,
        },

        is_graduated: {
            type: Boolean,
            required: true,
            default: false,
        },
        student_id: {
            type: String,
            required: true,
        },
        has_uploaded_capstone: {
            type: Boolean,
            required: true,
        },
    },
    {
        saveUnknown: false,
        timestamps: true,
    }
)

const presentationSchema = new dynamoosee.Schema({
    presentation_id: {
        type: String,
        hashKey: true,
    },
    start_time: Number,
    end_time: Number,
    presentation_duration: Number,
    break_time: Number,
})

const timeSlotSchema = new dynamoosee.Schema({
    time_slot_id: {
        type: String,
        hashKey: true,
    },
    start_time: Number,
    end_time: Number,
    is_available: Boolean,
    registered_student_id: String,
})

const registrationSchema = new dynamoosee.Schema({
    registration_id: {
        type: String,
        hashKey: true,
    },
    student_id: {
        type: String,
        required: true,
        index: {
            name: "studentIdIndex",
        },
    },
    time_slot_id: String,
    registration_timestamp: Number,
    capstone_title: String,
    capstone_abstract: String,
})

const user = dynamoosee.model<User>("cpss-user", userSchema, {
    create: false,
    waitForActive: false,
})
const timeslot = dynamoosee.model("cpss-timeSlot", timeSlotSchema, {
    create: false,
    waitForActive: false,
})
const registration = dynamoosee.model("cpss-registration", registrationSchema, {
    create: false,
    waitForActive: false,
})
const presentation = dynamoosee.model("cpss-presentation", presentationSchema, {
    create: false,
    waitForActive: false,
})

export {
    user as userModel,
    timeslot as timeSlotModel,
    registration as registrationModel,
    presentation as presentationModel,
}
