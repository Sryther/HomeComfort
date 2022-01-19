import {Request, Response, NextFunction} from "express";
import SerialPort from "serialport";
import Lumene, {LumeneDocument} from "../../../data/models/projection-screen/lumene/Lumene";
import Promisify from "../../../lib/Promisify";

const UP_HEX_VALUE = 0xFFEEEEEEDD;
const DOWN_HEX_VALUE = 0xFFEEEEEEEE;
const STOP_HEX_VALUE = 0xFFEEEEEECC;
const ALLOW_CONTROL_HEX_VALUE = 0xFFEEEEEEAA;

const up = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const screen = await Lumene.findById(req.params.id);

        if (screen) {
            await sendWrite(screen, ALLOW_CONTROL_HEX_VALUE);
            await sendWrite(screen, UP_HEX_VALUE);
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
            await sendWrite(screen, ALLOW_CONTROL_HEX_VALUE);
            await sendWrite(screen, DOWN_HEX_VALUE);
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

const sendWrite = async (screen: LumeneDocument, hexValue: Number) => {
    const port = new SerialPort(screen.serialPortPath);
    await Promisify(port.on, "error");
    await Promisify(port.write, hexValue);
}

export default { up, down };
