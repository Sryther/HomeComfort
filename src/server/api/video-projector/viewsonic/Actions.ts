import {Request, Response, NextFunction} from "express";
import SerialPort from "serialport";
import ViewSonic , {ViewSonicDocument} from "../../../data/models/video-projector/viewsonic/ViewSonic";

const ON_HEX_VALUE = "0614000400341100005D";
const OFF_HEX_VALUE = "0614000400341101005E";
const STATE_HEX_VALUE = "071400050034000011005E";

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

const sendWrite = async (projector: ViewSonicDocument, hexValue: string) => {
    return new Promise((resolve, reject) => {
        try {
            const port = new SerialPort(projector.serialPortPath);
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

export default { on, off };
