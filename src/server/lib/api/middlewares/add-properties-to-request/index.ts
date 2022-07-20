import {NextFunction, Request, Response} from "express";

import _ = require("lodash");

export type HelixRequest = Request & { deviceId?: string, deviceType?: string }

const addPropertiesToRequestInterceptor = async (req: HelixRequest, res: Response, next: NextFunction) => {
    try {
        let deviceId;
        if (!_.isNil(req.params.id)) {
            deviceId = req.params.id;
        } else {
            const matcherDeviceId = req.originalUrl.match("[0-9a-fA-F]{24}");
            if (matcherDeviceId !== null && matcherDeviceId.length > 0) {
                deviceId = matcherDeviceId[0];
            }
        }

        if (!_.isNil(deviceId)) {
            req.deviceId = deviceId;
        }

        next();
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

export default addPropertiesToRequestInterceptor;
