import { Types } from 'mongoose';
import {Request, Response, NextFunction} from "express";

import Composition from "../../../data/models/layouts/Composition";
import Map from "../../../data/models/layouts/Map";

const all = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const compositions = await Composition.find();
        return res.status(200).send(compositions);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const composition = await Composition.findById(req.params.id);

        if (composition) {
            return res.status(200).send(composition);
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const maps = req.body.maps;
        const foundMaps = await maps.map(async (map: Types.ObjectId) => {
            return Map.findById(map);
        }).filter(Boolean); // Removes null.

        if (foundMaps.length !== maps.length) {
            return res.status(404).send('One or multiple maps weren\'t found.');
        }

        const composition = new Composition({
            name: req.body.name,
            maps: req.body.maps
        });

        await composition.save();

        return res.status(201).send(composition);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const composition = await Composition.findById(req.params.id);

        if (composition) {
            await composition.delete();
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
        const composition = await Composition.findById(req.params.id);

        if (composition) {
            if (req.body.name) {
                composition.name = req.body.name;
            }
            if (req.body.maps) {
                composition.maps = req.body.maps;
            }

            await composition.save();
            return res.sendStatus(200);
        } else {
            return res.sendStatus(404);
        }
    } catch (e) {
        return res.status(500).send(e);
    }
}

export { create, all, get, remove, update };
