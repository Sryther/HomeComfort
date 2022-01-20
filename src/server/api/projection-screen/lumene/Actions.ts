import {Request, Response, NextFunction} from "express";
import Lumene, {LumeneDocument} from "../../../data/models/projection-screen/lumene/Lumene";
import Serial from "../../../lib/serial/Serial";

const UP_HEX_VALUE = "FFEEEEEEDD";
const DOWN_HEX_VALUE = "FFEEEEEEEE";
const STOP_HEX_VALUE = "FFEEEEEECC";
const ALLOW_CONTROL_HEX_VALUE = "FFEEEEEEAA";

const up = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const screen = await Lumene.findById(req.params.id);

        if (screen) {
            await Serial.write(screen.serialPortPath, ALLOW_CONTROL_HEX_VALUE);
            await Serial.write(screen.serialPortPath, UP_HEX_VALUE);
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
            await Serial.write(screen.serialPortPath, ALLOW_CONTROL_HEX_VALUE);
            await Serial.write(screen.serialPortPath, DOWN_HEX_VALUE);
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

export default { up, down };
