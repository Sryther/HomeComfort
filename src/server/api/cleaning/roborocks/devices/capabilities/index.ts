import Roborock from "../../../../../data/models/Roborock";
import miio from "miio";

import ControlApi from "./control";
import StateApi from "./state";

const getCapabilities = async (req: any, res: any, next: any) => {
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