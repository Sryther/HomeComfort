import {NextFunction, Request, Response} from "express";
import { Types } from "mongoose";

export default function (paramsToVerify: string[], req: Request, res: Response, next: NextFunction) {
    for (const param of paramsToVerify) {
        try {
            new Types.ObjectId(req.params[param]);
        } catch (error) {
            return res.status(400).send(`${param} is not an ObjectId`);
        }
    }
}
