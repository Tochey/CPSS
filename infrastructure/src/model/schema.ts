import dynamoosee from "dynamoose"
import { Item } from "dynamoose/dist/Item"
dynamoosee.aws.ddb.local()

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
                name: "roleIndex",
            },
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
        }
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
    presentation_duration : Number,
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
    student_id: String,
    time_slot_id: String,
    registration_timestamp: Number,
})

const user = dynamoosee.model<User>("user", userSchema)
const timeslot = dynamoosee.model("timeSlot", timeSlotSchema)
const registration = dynamoosee.model("registration", registrationSchema)
const presentation = dynamoosee.model("presentation", presentationSchema)
const userTable = new dynamoosee.Table("user", [user])
const timeSlotTable = new dynamoosee.Table("timelsot", [timeslot])
const registrationTable = new dynamoosee.Table("registration", [registration])
const presentationTable = new dynamoosee.Table("presentation", [presentation])
export {
    user as userModel,
    timeslot as timeSlotModel,
    registration as registrationModel,
    presentation as presentationModel,
}
