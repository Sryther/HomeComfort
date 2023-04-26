import {NextFunction, Response} from "express";
import moment from "moment";

import Event from "../../../../data/models/event/Event";
import {HelixRequest} from "../add-properties-to-request";
import _ from "lodash";

const saveEventsInterceptor = async (req: HelixRequest, res: Response, next: NextFunction) => {
    try {
        if (req.method === "GET" || (!_.isNil(req.header("helix")) && req.header("helix") === "self")) {
            next();
            return;
        }

        await Event.create({
            deviceId: req.deviceId,
            deviceType: req.deviceType,
            httpVerb: req.method,
            route: req.originalUrl,
            args: Object.assign({}, req.body),
            date: moment().valueOf()
        });

        next();
    } catch (error: any) {
        console.error(`Couldn't save the event`, error);
        return res.status(500).send(error.message);
    }
};

export default saveEventsInterceptor;
