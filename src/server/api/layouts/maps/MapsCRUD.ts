import {Request, Response, NextFunction} from "express";

import Map from "../../../data/models/layouts/Map";

const all = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const maps = await Map.find();
        return res.status(200).send(maps);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const map = await Map.findById(req.params.id);

        if (map) {
            return res.status(200).send(map);
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const map = new Map({
            name: req.body.name,
            svg: req.body.svg,
            floor: req.body.floor
        });

        await map.save();

        return res.status(201).send(map);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const map = await Map.findById(req.params.id);

        if (map) {
            await map.delete();
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
        const map = await Map.findById(req.params.id);

        if (map) {
            if (req.body.name) {
                map.name = req.body.name;
            }
            if (req.body.svg) {
                map.svg = req.body.svg;
            }
            if (req.body.floor) {
                map.floor = req.body.floor;
            }

            await map.save();
            return res.sendStatus(200);
        } else {
            return res.sendStatus(404);
        }
    } catch (e) {
        return res.status(500).send(e);
    }
}

export { create, all, get, remove, update };
