import {Request, Response, NextFunction} from "express";
import SerialPort from "serialport";
import ViewSonic , {ViewSonicDocument} from "../../../data/models/video-projector/viewsonic/ViewSonic";
import Promisify from "../../../lib/Promisify";

const ON_HEX_VALUE = 0x0614000400341100005D;
const OFF_HEX_VALUE = 0x0614000400341101005E;
const STATE_HEX_VALUE = 0x071400050034000011005E;

const on = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projector = await ViewSonic.findById(req.params.id);

        if (projector) {
            await sendWrite(projector, ON_HEX_VALUE);
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
            await sendWrite(projector, OFF_HEX_VALUE);
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

const sendWrite = async (projector: ViewSonicDocument, hexValue: Number) => {
    const port = new SerialPort(projector.serialPortPath);
    await Promisify(port.on, "error");
    await Promisify(port.write, hexValue);
}

const sendRead = async (projector: ViewSonicDocument, hexValue: Number) => {
    const port = new SerialPort(projector.serialPortPath);
    await Promisify(port.on, "error");
    await Promisify(port.read, hexValue);
}

export default { on, off };
