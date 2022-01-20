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
            await Serial.write(projector.serialPortPath, 115200, ON_HEX_VALUE);

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
            await Serial.write(projector.serialPortPath, 115200, OFF_HEX_VALUE);
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
            const data = await Serial.read(projector.serialPortPath, 115200, STATE_HEX_VALUE);
            let output = "UNKNOWN";
            if (data === "051400030000000017") {
                output = "OFF";
            } else if (data === "051400030000000118") {
                output = "ON";
            }
            return res.status(200).send(output);
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

export default { on, off, state };
