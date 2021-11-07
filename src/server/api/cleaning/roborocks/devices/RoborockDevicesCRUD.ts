import {Request, Response, NextFunction} from "express";

import Roborock from "../../../../data/models/cleaning/roborock/Roborock";

const all = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roborocks = await Roborock.find();
        return res.status(200).send(roborocks);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roborock = await Roborock.findById(req.params.id);

        if (roborock) {
            return res.status(200).send(roborock);
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roborock = new Roborock({
            name: req.body.name,
            ip: req.body.ip,
            token: req.body.token,
            type: req.body.type
        });

        await roborock.save();

        return res.status(201).send(roborock);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roborock = await Roborock.findById(req.params.id);

        if (roborock) {
            await roborock.delete();
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
        const roborock = await Roborock.findById(req.params.id);

        if (roborock) {
            if (req.body.name) {
                roborock.name = req.body.name
            }
            if (req.body.ip) {
                roborock.ip = req.body.ip;
            }
            if (req.body.token) {
                roborock.token = req.body.token;
            }

            await roborock.save();
            return res.sendStatus(200);
        } else {
            return res.sendStatus(404);
        }
    } catch (e) {
        return res.status(500).send(e);
    }
}

export { create, all, get, remove, update };
