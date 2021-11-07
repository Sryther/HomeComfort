import {Request, Response, NextFunction} from "express";

import DaikinAirCondtioner from "../../../data/models/air/daikin/AirConditionner";

const all = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const acs = await DaikinAirCondtioner.find();
        return res.status(200).send(acs);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ac = await DaikinAirCondtioner.findById(req.params.id);

        if (ac) {
            return res.status(200).send(ac);
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ac = new DaikinAirCondtioner({
            name: req.body.name,
            ip4: req.body.ip4,
            ip6: req.body.ip6
        });

        await ac.save();

        return res.status(201).send(ac);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ac = await DaikinAirCondtioner.findById(req.params.id);

        if (ac) {
            await ac.delete();
            return res.sendStatus(200);
        } else {
            return res.sendStatus(404);
        }
    } catch (e) {
        return res.status(500).send(e);
    }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ac = await DaikinAirCondtioner.findById(req.params.id);

        if (ac) {
            if (req.body.ip4) {
                ac.ip4 = req.body.ip4;
            }
            if (req.body.ip6) {
                ac.ip6 = req.body.ip6;
            }
            if (req.body.name) {
                ac.name = req.body.name;
            }

            await ac.save();
            return res.sendStatus(200);
        } else {
            return res.sendStatus(404);
        }
    } catch (e) {
        return res.status(500).send(e);
    }
}

export { create, all, get, remove, update };
