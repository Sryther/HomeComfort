import {Request, Response, NextFunction} from "express";
import ViewSonic  from "../../../data/models/video-projector/viewsonic/ViewSonic";
import Serial from "../../../lib/serial/Serial";

const ON_HEX_VALUE = [0x06, 0x14, 0x00, 0x04, 0x00, 0x34, 0x11, 0x00, 0x00, 0x5D];
const OFF_HEX_VALUE = [0x06, 0x14, 0x00, 0x04, 0x00, 0x34, 0x11, 0x01, 0x00, 0x5E];
const STATE_HEX_VALUE = [0x07, 0x14, 0x00, 0x05, 0x00, 0x34, 0x00, 0x00, 0x11, 0x00, 0x5E];

const on = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projector = await ViewSonic.findById(req.params.id);

        if (projector) {
            await Serial.write(projector.serialPortPath, ON_HEX_VALUE);

            return res.sendStatus(200);
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
            return res.sendStatus(200);
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

const state = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projector = await ViewSonic.findById(req.params.id);

        if (projector) {
            const data = await Serial.read(projector.serialPortPath, STATE_HEX_VALUE);
            return res.status(200).send(data);
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

export default { on, off, state };
