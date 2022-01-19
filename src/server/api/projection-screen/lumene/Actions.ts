import {Request, Response, NextFunction} from "express";
import SerialPort from "serialport";
import Lumene, {LumeneDocument} from "../../../data/models/projection-screen/lumene/Lumene";
import Promisify from "../../../lib/Promisify";

const UP_HEX_VALUE = "FFEEEEEEDD";
const DOWN_HEX_VALUE = "FFEEEEEEEE";
const STOP_HEX_VALUE = "FFEEEEEECC";
const ALLOW_CONTROL_HEX_VALUE = "FFEEEEEEAA";

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

const sendWrite = async (screen: LumeneDocument, hexValue: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
            const port = new SerialPort(screen.serialPortPath);
            port.on("error", error => {
                reject(error);
            });

            port.write(Buffer.from(hexValue, "hex"));
            resolve(null);
        } catch(e) {
            reject(e);
        }
    });
}

export default { up, down };
