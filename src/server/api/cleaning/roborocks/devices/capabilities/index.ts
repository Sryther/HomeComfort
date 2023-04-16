import {Request, Response, NextFunction} from "express";
import miio from "miio";

import Roborock from "../../../../../data/models/cleaning/roborock/Roborock";

import ControlApi from "./control";
import StateApi from "./state";

const getCapabilities = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roborock = await Roborock.findById(req.params.id);

        if (roborock) {
            const device = await miio.device({ address: roborock.ip, token: roborock.token });
            const actions = Object.keys(device.metadata.actions);

            return res.status(200).send(actions);
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

export default { getCapabilities, ControlApi, StateApi };
