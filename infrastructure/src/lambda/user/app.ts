import parse from "body-parser"
import cors from "cors"
import express from "express"
import { v4 } from "uuid"
import { presentationModel, registrationModel, timeSlotModel, userModel } from "../../model/schema"

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
        const p = await presentationModel.scan().exec();
        return res.status(200).json(p);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

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
    const { start_time, end_time, presentation_duration, break_time } = req.body;
    try {
        const p = await presentationModel.scan().exec();
        

        if (p.length > 0) {
            throw new Error("There is an active presentation already");
        }

        await presentationModel.create({
            presentation_id: v4(),
            start_time: new Date(start_time).getTime(),
            end_time: new Date(end_time).getTime(),
            presentation_duration: parseInt(presentation_duration),
            break_time: parseInt(break_time),
        });

        const st = new Date(start_time);
        const et = new Date(end_time);
        const duration = presentation_duration;
        const breakDuration = break_time || 0; 

        const time_slots = [];
        let time = st;
        while (time < et) {
            const time_slot_id = v4();
            const slotEndTime = time.getTime() + duration * 60 * 1000;
            if (slotEndTime > et.getTime()) {
                break; 
            }
            time_slots.push({
                time_slot_id,
                start_time: time.getTime(),
                end_time: slotEndTime,
                is_available: true,
                registered_student_id: "",
            });
            time = new Date(slotEndTime + breakDuration * 60 * 1000); 
        }

        await Promise.all(
            time_slots.map((time_slot) => timeSlotModel.create(time_slot))
        );

        res.json({ message: "Time slots created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


app.post("/user/registerTimeSlot", async (req, res) => {
    try {
        const { student_id, time_slot_id } = req.body

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

app.delete("/user/deletePresentation", async (req, res) => {
    try {
        const p = await presentationModel.scan().exec();
        await presentationModel.batchDelete(p);
        
        const timeSlots = await timeSlotModel.scan().exec()

        if (timeSlots.length === 0) {
            return res.status(404).json({ error: "No time slots found" })
        }

        await timeSlotModel.batchDelete(timeSlots)

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
