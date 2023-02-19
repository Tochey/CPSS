import parse from "body-parser"
import cors from "cors"
import { Item } from "dynamoose/dist/Item"
import express from "express"
import { registrationModel, timeSlotModel, userModel } from "../../model/schema"

const app = express()
app.use(parse.json())
app.use(cors())

app.get(
    "/user/getAllStudents",
    async function (req: express.Request, res: express.Response) {
        return userModel
            .query("ROLE")
            .eq("STUDENT")
            .exec()
            .then((data) => {
                res.status(200).send(data)
            })
    }
)

app.get(
    "/user/getAllFaculty",
    async function (req: express.Request, res: express.Response) {
        return userModel
            .query("ROLE")
            .eq("FACULTY")
            .exec()
            .then((data) => {
                res.status(200).send(data)
            })
    }
)

app.delete(
    "/user/deleteStudent/:userId",
    async function (req: express.Request, res: express.Response) {
        const user = await userModel.get({ userId: req.params.userId })
        if (!user) {
            res.status(404).send("User not found")
        }
        return user.delete().then((data) => {
            res.status(200).send(data)
        })
    }
)

app.delete(
    "/user/deleteFaculty/:userId",
    async function (req: express.Request, res: express.Response) {
        const user = await userModel.get({ userId: req.params.userId })
        if (!user) {
            res.status(404).send("User not found")
        }
        return user.delete().then((data) => {
            res.status(200).send(data)
        })
    }
)

// Define route for creating time slots
app.post("/user/createTimeSlots", async (req, res) => {
    const { start_time, end_time, presentation_duration } = req.body
    try {
        const st = new Date(start_time)
        const et = new Date(end_time)
        const duration = presentation_duration

        // Calculate time slots based on duration and start/end times
        const time_slots = []
        for (
            let time = st;
            time < et && time.getTime() + duration * 60 * 1000 <= et.getTime();
            time.setMinutes(time.getMinutes() + duration)
        ) {
            const time_slot_id = `${time.getTime()}`
            time_slots.push({
                time_slot_id,
                start_time: time.getTime(),
                end_time: time.getTime() + duration * 60 * 1000,
                is_available: true,
                registered_student_id: "",
            })
        }

        // Add time slots to DynamoDB
        await Promise.all(
            time_slots.map((time_slot) => timeSlotModel.create(time_slot))
        )

        res.json({ message: "Time slots created successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

// Define route for registering for a time slot
app.post("/user/registerTimeSlot", async (req, res) => {
    try {
        const { student_id, time_slot_id } = req.body

        // Check if time slot is available
        const time_slot = await timeSlotModel.get({ time_slot_id })
        if (!time_slot.is_available) {
            return res.status(400).json({ error: "Time slot is not available" })
        }

        // Register student for time slot
        await timeSlotModel.update({
            time_slot_id,
            is_available: false,
            registered_student_id: student_id,
        })

        // Add registration to DynamoDB
        await registrationModel.create({
            registration_id: `${time_slot_id}_${student_id}`,
            student_id,
            time_slot_id,
            registration_timestamp: Date.now(),
        })

        res.json({ message: "Registration successful" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

app.delete("/user/deleteTimeSlots", async (req, res) => {
    try {
        const timeSlots = await timeSlotModel.scan().exec()

        if (timeSlots.length === 0) {
            return res.status(404).json({ error: "No time slots found" })
        }

        await timeSlotModel.batchDelete(timeSlots)

        const registrations = await registrationModel.scan().exec()

        if (registrations.length === 0) {
            return res
                .status(200)
                .json({
                    error: "No registrations found but timeslot have been deleted",
                })
        }

        await registrationModel.batchDelete(registrations)

        return res
            .status(200)
            .json({
                message: "All time slots and registrations have been deleted",
            })
    } catch (err) {
        console.error(err)
        return res
            .status(500)
            .json({
                error: "An error occurred while deleting time slots and registrations",
            })
    }
})

export { app }
