import * as miio from 'miio';
import {Request, Response, NextFunction} from "express";

import Roborock from "../../../../data/models/cleaning/roborock/Roborock";
import CapabilitiesApi from "./capabilities";
import MapApi from "./map";
import CRUDRouting from "../../../../lib/api/CRUDRouting";

const router = CRUDRouting.createRouter(new CRUDRouting.CRUDRouter<typeof Roborock>(Roborock));

router.get('/:id/info', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roborock = await Roborock.findById(req.params.id);

        if (roborock) {
            const device = await miio.device({ address: roborock.ip, token: roborock.token });

            return res.status(200).json(device);
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
});

router.get('/:id/capabilities', CapabilitiesApi.getCapabilities);
router.post('/:id/capabilities/control', CapabilitiesApi.ControlApi.doAction);
router.get('/:id/capabilities/state', CapabilitiesApi.StateApi.getState);
router.get('/:id/capabilities/state/:data', CapabilitiesApi.StateApi.getSpecificState);

router.get('/:id/map', MapApi.getMap);

export default router;
