import { Types } from 'mongoose';
import {Request, Response, NextFunction} from "express";

import Composition from "../../../data/models/layouts/Composition";
import Map from "../../../data/models/layouts/Map";
import CRUDRouting from "../../../lib/api/CRUDRouting";

class CompositionsCRUDRouter extends CRUDRouting.CRUDRouter<typeof Composition> {
    constructor() {
        super(Composition);
    }

    public async create (req: Request, res: Response, next: NextFunction): Promise<any> {
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
}

export default CompositionsCRUDRouter;
