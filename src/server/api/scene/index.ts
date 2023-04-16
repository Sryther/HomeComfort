import CRUDRouting from "../../lib/api/CRUDRouting";
import Scene from "../../data/models/scene/Scene";
import {NextFunction, Request, Response} from "express";
import CRONManager from "../../lib/api/CRONManager";
import _ from "lodash";

const router = CRUDRouting.createRouter(new CRUDRouting.CRUDRouter<typeof Scene>(Scene));

router.post("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const sceneId = req.params.id;
    try {
        const scene = await Scene.findById(sceneId);
        if (scene) {
            await CRONManager.runScene(scene);
            return res.sendStatus(200);
        }
        return res.sendStatus(404);
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
});

router.delete("/:id/action/:actionId", async (req: Request, res: Response, next: NextFunction) => {
    const sceneId = req.params.id;
    try {
        const scene = await Scene.findById(sceneId);
        if (scene) {
            let backupOrder: number;
            scene.actions = scene.actions.filter(action => {
                if (action._id === req.params.actionId) {
                    if (!_.isNil(action.order)) {
                        backupOrder = action.order;
                    }
                    return false;
                }
                return true;
            });

            // @ts-ignore
            if (_.isNil(backupOrder)) {
                return res.sendStatus(404);
            }

            scene.actions = scene.actions.map(action => {
                if (action.order && action.order > backupOrder) {
                    action.order--;
                }
                return action;
            });
            await scene.save();

            return res.sendStatus(200);
        }
        return res.sendStatus(404);
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
});


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
