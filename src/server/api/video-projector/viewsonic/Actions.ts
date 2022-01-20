import {Request, Response, NextFunction} from "express";
import ViewSonic  from "../../../data/models/video-projector/viewsonic/ViewSonic";
import Serial from "../../../lib/serial/Serial";

const ON_HEX_VALUE = "0614000400341100005D";
const OFF_HEX_VALUE = "0614000400341101005E";
const STATE_HEX_VALUE = "071400050034000011005E";

const on = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projector = await ViewSonic.findById(req.params.id);

        if (projector) {
            await Serial.write(projector.serialPortPath, ON_HEX_VALUE);
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

const off = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projector = await ViewSonic.findById(req.params.id);

        if (projector) {
            await Serial.write(projector.serialPortPath, OFF_HEX_VALUE);
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

export default { on, off };
