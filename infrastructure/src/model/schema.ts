import dynamoosee from "dynamoose"
import { Item } from "dynamoose/dist/Item"
dynamoosee.aws.ddb.local()

interface User extends Item {
    userId: string
    email: string
    name: string
    ROLE: "STUDENT" | "FACULTY" | "ADMIN"
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
    },
    {
        saveUnknown: false,
        timestamps: true,
    }
)

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
const registration = dynamoosee.model("user", registrationSchema)
const userTable = new dynamoosee.Table("user", [user])
const timeSlotTable = new dynamoosee.Table("timelsot", [timeslot])
const registrationTable = new dynamoosee.Table("registration", [registration])
export {
    user as userModel,
    timeslot as timeSlotModel,
    registration as registrationModel,
}
