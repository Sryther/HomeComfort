import express, {NextFunction, Request, Response} from "express";
import CRUDRouting from "../../lib/api/CRUDRouting";
import CRONManager from "../../lib/api/CRONManager";
import Schedule from "../../data/models/schedule/Schedule";

const crud = new CRUDRouting.CRUDRouter<typeof Schedule>(Schedule);
const router = express.Router();

router.get("/devices/:deviceType/:deviceId", async (req: Request, res: Response, next: NextFunction) => {
    const deviceId = req.params.deviceId;
    const deviceType = req.params.deviceType;

    try {
        const schedules = await Schedule.find({"action.deviceId": deviceId, "action.deviceType": deviceType });

        return res.status(200).send(schedules);
    } catch(error) {
        console.error(`Couldn't retrieve schedules for device ${deviceId} (${deviceType})`, error);
        return res.status(500).send(error);
    }
});

// Create: persist the schedule AND register a live cron job so it fires without
// waiting for the next server restart. The generic CRUD create would only save it.
router.post("/", async (req: Request, res: Response) => {
    try {
        const schedule = await Schedule.create(req.body);
        CRONManager.register(schedule);
        console.log(`Created and scheduled job id=${schedule._id} cron="${schedule.cronExpression}"`);
        return res.status(201).send(schedule);
    } catch (error: any) {
        console.error("Couldn't create schedule", error);
        return res.status(500).send(error.message);
    }
});

// Remove: stop the live cron job and delete the document.
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        await CRONManager.removeJob(req.params.id);
        return res.sendStatus(200);
    } catch (error: any) {
        console.error(`Couldn't remove schedule ${req.params.id}`, error);
        return res.status(500).send(error.message);
    }
});

// Remaining CRUD operations (list all, get one, update).
router.get("/", crud.all.bind(crud));
router.get("/:id", crud.get.bind(crud));
router.put("/:id", crud.update.bind(crud));

export default router;
