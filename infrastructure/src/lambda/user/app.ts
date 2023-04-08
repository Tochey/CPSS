import cors from "cors"
import express from "express"
import { v4 } from "uuid"
import {
    presentationModel,
    registrationModel,
    timeSlotModel,
    userModel,
} from "./schema"

const app = express()
app.use(express.json())
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://main.d77mtlby88qvh.amplifyapp.com"
        ],
        credentials: true,
    })
)

app.get(
    "/user/getAllStudents",
    async function (req: express.Request, res: express.Response) {
        const students = await userModel.query("ROLE").eq("STUDENT").exec()
        res.status(200).send(students)
    }
)


app.get("/user/getStudent/:userId", async (req, res) => {
    try {
        const user = await userModel.get({ userId: req.params.userId })
        if (!user) {
            res.status(404).send("User not found")
        }
        res.status(200).send(user)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

app.get(
    "/user/getAllFaculty",
    async function (req: express.Request, res: express.Response) {
        const fac = await userModel.get({ ROLE: "FACULTY" })
        res.status(200).send(fac)
    }
)

app.post("/user/updateStudent/:userId", async (req, res) => {
    const { userId } = req.params
    const updates = req.body
    try {
        userModel.update({ userId }, updates)
        return res.status(200).send("Student updated successfully")
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

app.get("/user/getPresentationIfAny", async (req, res) => {
    try {
        const p = await presentationModel.scan().exec()
        return res.status(200).json(p)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

app.get("/user/getTimeSlots", async (req, res) => {
    try {
        const time_slots = await timeSlotModel.scan().exec()
        return res.status(200).json(time_slots)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

app.get("/user/getRegistration/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params
        const registration = await registrationModel
            .query("student_id")
            .eq(studentId)
            .exec()
        return res.status(200).json(registration)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

app.delete("/user/deleteRegistration/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params
        const registration = await registrationModel
            .query("student_id")
            .eq(studentId)
            .exec()
        if (registration.length === 0) {
            return res.status(404).send("Registration not found")
        }

        await timeSlotModel.update(
            { time_slot_id: registration[0].time_slot_id },
            { is_available: true }
        )

        await registration[0].delete()
        return res.status(200).send("Registration deleted successfully")
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

app.get("/user/getAllRegistrations", async (req, res) => {
    try {
        const registrations = await registrationModel.scan().exec()
        return res.status(200).json(registrations)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

app.get("/user/getTimeSlot/:timeSlotId", async (req, res) => {
    try {
        const { timeSlotId } = req.params
        const time_slot = await timeSlotModel.get({ time_slot_id: timeSlotId })
        return res.status(200).json(time_slot)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

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

app.post("/user/createPresentation", async (req, res) => {
    const { start_time, end_time, presentation_duration, break_time } = req.body
    try {
        const p = await presentationModel.scan().exec()

        if (p.length > 0) {
            throw new Error("There is an active presentation already")
        }

        const st = new Date(start_time)
        const et = new Date(end_time)
        const duration = presentation_duration
        const breakDuration = break_time || 0

        const time_slots = []
        let time = st
        while (time < et) {
            const time_slot_id = v4()
            const slotEndTime = time.getTime() + duration * 60 * 1000
            if (slotEndTime > et.getTime()) {
                break
            }
            time_slots.push({
                time_slot_id,
                start_time: time.getTime(),
                end_time: slotEndTime,
                is_available: true,
                registered_student_id: "",
            })
            time = new Date(slotEndTime + breakDuration * 60 * 1000)
        }

        if (time_slots.length > 50) {
            return res.status(400).json({
                message: "Too many time slots. Please reduce the duration",
            })
        }

        await presentationModel.create({
            presentation_id: v4(),
            start_time: new Date(start_time).getTime(),
            end_time: new Date(end_time).getTime(),
            presentation_duration: parseInt(presentation_duration),
            break_time: parseInt(break_time),
        })

        await Promise.all(
            time_slots.map((time_slot) => timeSlotModel.create(time_slot))
        )

        res.json({ message: "Time slots created successfully" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

app.post("/user/registerTimeSlot", async (req, res) => {
    try {
        const { student_id, time_slot_id, capstone_title, capstone_abstract } =
            req.body

        const time_slot = await timeSlotModel.get({ time_slot_id })
        if (!time_slot.is_available) {
            return res.status(400).json({ error: "Time slot is not available" })
        }

        await timeSlotModel.update({
            time_slot_id,
            is_available: false,
            registered_student_id: student_id,
        })

        await registrationModel.create({
            registration_id: v4(),
            student_id,
            time_slot_id,
            registration_timestamp: Date.now(),
            capstone_title,
            capstone_abstract,
        })

        res.json({ message: "Registration successful" })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
})

app.delete("/user/deletePresentation", async (req, res) => {
    try {
        const p = await presentationModel.scan().exec()

        for (const pres of p) {
            await presentationModel.delete({
                presentation_id: pres.presentation_id,
            })
        }

        const timeSlots = await timeSlotModel.scan().exec()

        if (timeSlots.length === 0) {
            return res.status(404).json({ error: "No time slots found" })
        }

        for (const timeSlot of timeSlots) {
            await timeSlotModel.delete({ time_slot_id: timeSlot.time_slot_id })
        }

        const registrations = await registrationModel.scan().exec()

        if (registrations.length === 0) {
            return res.status(200).json({
                error: "No registrations found but timeslot have been deleted",
            })
        }

        await registrationModel.batchDelete(registrations)

        return res.status(200).json({
            message: "All time slots and registrations have been deleted",
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            error: "An error occurred while deleting time slots and registrations",
        })
    }
})

export { app }
