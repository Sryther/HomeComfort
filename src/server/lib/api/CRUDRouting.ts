import * as express from "express";
import {Request, Response, NextFunction, Router} from "express";
import {Model as MongooseModel, Types} from "mongoose";
import _ from "lodash";
import ObjectIdVerifier from "./ObjectIdVerifier";

interface ICRUDRouting {
    get (req: Request, res: Response, next: NextFunction): any;
    all (req: Request, res: Response, next: NextFunction): any;
    create (req: Request, res: Response, next: NextFunction): any;
    update (req: Request, res: Response, next: NextFunction): any;
    remove (req: Request, res: Response, next: NextFunction): any;
}

class CRUDRouter<M extends MongooseModel<any>> implements ICRUDRouting {
    Model: M;

    constructor(model: M) {
        this.Model = model;
    }

    public async all(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            console.log(`[${this.Model.modelName}] before .find()`);
            const items = await this.Model.find()
                .maxTimeMS(5000);
            console.log(`[${this.Model.modelName}] after .find()`);
            return res.status(200).send(items);
        } catch (e: any) {
            console.log(`[${this.Model.modelName}] error .find()`);
            console.error(e);
            return res.status(500).send(e.message);
        }
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            if (!_.isNil(ObjectIdVerifier(["id"], req, res, next))) return;

            console.log(`[${this.Model.modelName}] before .findById(${req.params.id})`);
            const item = await this.Model.findById(req.params.id);
            console.log(`[${this.Model.modelName}] after .findById(${req.params.id})`);

            if (item) {
                return res.status(200).send(item);
            }

            return res.sendStatus(404);
        } catch (e: any) {
            console.log(`[${this.Model.modelName}] error .findById(${req.params.id})`);
            console.error(e);
            return res.status(500).send(e.message);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            console.log(`[${this.Model.modelName}] before .create()`);
            const item = await this.Model.create(req.body);
            console.log(`[${this.Model.modelName}] after .create()`);

            return res.status(201).send(item);
        } catch (e: any) {
            console.log(`[${this.Model.modelName}] error .create()`);
            console.error(e);
            return res.status(500).send(e.message);
        }
    }

    public async update (req: Request, res: Response, next: NextFunction): Promise<any> {
        let item: MongooseModel<any> | any = null;
        try {
            if (!_.isNil(ObjectIdVerifier(["id"], req, res, next))) return;

            console.log(`[${this.Model.modelName}] before .findById(${req.params.id})`);
            item = await this.Model.findById(req.params.id);
            console.log(`[${this.Model.modelName}] after .findById(${req.params.id})`);

            if (!item) {
                return res.sendStatus(404);
            }
        } catch (e: any) {
            console.log(`[${this.Model.modelName}] error .find()`);
            console.error(e);
            return res.status(500).send(e.message);
        }

        try {
            if (item) {
                const keys: string[] = Object.keys(req.body);
                for (let i: number = 0; i < keys.length; i++) {
                    item[keys[i]] = req.body[keys[i]];
                }

                console.log(`[${this.Model.modelName}] before .save()`);
                await item.save();
                console.log(`[${this.Model.modelName}] after .save()`);
                return res.sendStatus(200);
            } else {
                return res.sendStatus(404);
            }
        } catch (e: any) {
            console.log(`[${this.Model.modelName}] error .save()`);
            console.error(e);
            return res.status(500).send(e.message);
        }
    }

    public async remove (req: Request, res: Response, next: NextFunction): Promise<any> {
        let item: MongooseModel<any> | any = null;
        try {
            if (!_.isNil(ObjectIdVerifier(["id"], req, res, next))) return;

            console.log(`[${this.Model.modelName}] before .findById(${req.params.id})`);
            item = await this.Model.findById(req.params.id);
            console.log(`[${this.Model.modelName}] after .findById(${req.params.id})`);

            if (!item) {
                return res.sendStatus(404);
            }
        } catch (e: any) {
            console.log(`[${this.Model.modelName}] error .find()`);
            console.error(e);
            return res.status(500).send(e.message);
        }

        try {
            if (item) {
                console.log(`[${this.Model.modelName}] before .delete()`);
                await item.delete();
                console.log(`[${this.Model.modelName}] after .delete()`);
                return res.sendStatus(200);
            } else {
                return res.sendStatus(404);
            }
        } catch (e: any) {
            console.log(`[${this.Model.modelName}] remove .delete()`);
            console.error(e);
            return res.status(500).send(e.message);
        }
    };
}

const createRouter = (crudRouter: CRUDRouter<typeof MongooseModel>, router: Router = express.Router()) => {
    router.get('/', crudRouter.all.bind(crudRouter));
    router.get('/:id', crudRouter.get.bind(crudRouter));
    router.post('/', crudRouter.create.bind(crudRouter));
    router.put('/:id', crudRouter.update.bind(crudRouter));
    router.delete('/:id', crudRouter.remove.bind(crudRouter));

    return router;
};

export default { CRUDRouter, createRouter };
