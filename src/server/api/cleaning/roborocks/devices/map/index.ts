import {Request, Response, NextFunction} from "express";

import Roborock from "../../../../../data/models/cleaning/roborock/Roborock";
import XiaomiService from "../../../../../lib/xiaomi/service/XiaomiService";

const getMap = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roborock = await Roborock.findById(req.params.id);

        if (roborock) {
            let username: string, password: string;
            if (req.query.username && req.query.password) {
                username = req.query.username.toString();
                password = req.query.password.toString();
            } else {
                return res.sendStatus(400);
            }
            const xiaomiService = new XiaomiService(username, password);
            const map = await xiaomiService.getMap(roborock);

            return res.status(200).send(map);
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

export default { getMap };
