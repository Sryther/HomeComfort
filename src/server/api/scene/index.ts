import CRUDRouting from "../../lib/api/CRUDRouting";
import Scene from "../../data/models/scene/Scene";
import {NextFunction, Request, Response} from "express";

const router = CRUDRouting.createRouter(new CRUDRouting.CRUDRouter<typeof Scene>(Scene));

router.get("/devices/:deviceType/:deviceId", async (req: Request, res: Response, next: NextFunction) => {
    const deviceId = req.params.deviceId;
    const deviceType = req.params.deviceType;

    try {
        const schedules = await Scene.find({
            deviceType: deviceType,
            deviceId: deviceId
        });

        return res.status(200).send(schedules);
    } catch(error) {
        console.error(`Couldn't retrieve schedules for device ${deviceId} (${deviceType})`, error);
        return res.status(500).send(error);
    }
});

export default router;
