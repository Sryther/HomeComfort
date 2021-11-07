import {Request, Response, NextFunction} from "express";
import Endpoint from "../../../data/models/network/Endpoint";

const all = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const endpoints = await Endpoint.find();
        return res.status(200).send(endpoints);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const endpoint = await Endpoint.findById(req.params.id);

        if (endpoint) {
            return res.status(200).send(endpoint);
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const endpoint = new Endpoint({
            name: req.body.name,
            ip4: req.body.ip4,
            ip6: req.body.ip6,
            mac: req.body.mac
        });

        await endpoint.save();

        return res.status(201).send(endpoint);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const endpoint = await Endpoint.findById(req.params.id);

        if (endpoint) {
            await endpoint.delete();
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
        const endpoint = await Endpoint.findById(req.params.id);

        if (endpoint) {
            if (req.body.ip4) {
                endpoint.ip4 = req.body.ip4;
            }
            if (req.body.ip6) {
                endpoint.ip6 = req.body.ip6;
            }
            if (req.body.mac) {
                endpoint.mac = req.body.mac;
            }
            if (req.body.name) {
                endpoint.name = req.body.name;
            }

            await endpoint.save();
            return res.sendStatus(200);
        } else {
            return res.sendStatus(404);
        }
    } catch (e) {
        return res.status(500).send(e);
    }
}

export { create, all, get, remove, update };
