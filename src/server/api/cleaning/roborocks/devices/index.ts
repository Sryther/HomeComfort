import express from 'express';
import * as miio from 'miio';
import Roborock from "../../../../data/models/Roborock";
import * as CRUD from "./crud";

import CapabilitiesApi from "./capabilities";
import MapApi from "./map";

const router = express.Router();

router.get('/', CRUD.all);
router.get('/:id', CRUD.get);
router.post('/', CRUD.create);
router.delete('/:id', CRUD.remove);

router.get('/:id/info', async (req: any, res: any, next: any) => {
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