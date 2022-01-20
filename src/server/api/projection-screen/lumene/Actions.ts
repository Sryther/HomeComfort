import {Request, Response, NextFunction} from "express";
import Lumene, {LumeneDocument} from "../../../data/models/projection-screen/lumene/Lumene";
import Serial from "../../../lib/serial/Serial";

const UP_HEX_VALUE = [0xFF, 0xEE, 0xEE, 0xEE, 0xDD];
const DOWN_HEX_VALUE = [0xFF, 0xEE, 0xEE, 0xEE, 0xEE];
const STOP_HEX_VALUE = [0xFF, 0xEE, 0xEE, 0xEE, 0xCC];
const ALLOW_CONTROL_HEX_VALUE = [0xFF, 0xEE, 0xEE, 0xEE, 0xAA];

const up = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const screen = await Lumene.findById(req.params.id);

        if (screen) {
            //await Serial.write(screen.serialPortPath, 2400, ALLOW_CONTROL_HEX_VALUE);
            await Serial.write(screen.serialPortPath, 2400, UP_HEX_VALUE);

            return res.sendStatus(200);
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

const down = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const screen = await Lumene.findById(req.params.id);

        if (screen) {
            //await Serial.write(screen.serialPortPath, 2400, ALLOW_CONTROL_HEX_VALUE);
            await Serial.write(screen.serialPortPath, 2400, DOWN_HEX_VALUE);

            return res.sendStatus(200);
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

const stop = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const screen = await Lumene.findById(req.params.id);

        if (screen) {
            await Serial.write(screen.serialPortPath, 2400, ALLOW_CONTROL_HEX_VALUE);
            await Serial.write(screen.serialPortPath, 2400, STOP_HEX_VALUE);

            return res.sendStatus(200);
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

export default { up, down, stop };
