import * as express from "express";
import {Request, Response, NextFunction} from "express";
import {Model as MongooseModel, Types} from "mongoose";

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
            const items = await this.Model.find();
            return res.status(200).send(items);
        } catch (e: any) {
            console.error(e);
            return res.status(500).send(e.message);
        }
    }

    public async get(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            try {
                new Types.ObjectId(req.params.id);
            } catch (error) {
                return res.status(400).send("Not an ObjectId");
            }

            const item = await this.Model.findById(req.params.id);

            if (item) {
                return res.status(200).send(item);
            }

            return res.sendStatus(404);
        } catch (e: any) {
            console.error(e);
            return res.status(500).send(e.message);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const item = await this.Model.create(req.body);

            return res.status(201).send(item);
        } catch (e: any) {
            console.error(e);
            return res.status(500).send(e.message);
        }
    }

    public async update (req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            try {
                new Types.ObjectId(req.params.id);
            } catch (error) {
                return res.status(400).send("Not an ObjectId");
            }

            const item = await this.Model.findById(req.params.id);

            if (item) {
                const keys = Object.keys(req.body);
                for (let i = 0; i < keys.length; i++) {
                    item[keys[i]] = req.body[keys[i]];
                }

                await item.save();
                return res.sendStatus(200);
            } else {
                return res.sendStatus(404);
            }
        } catch (e: any) {
            console.error(e);
            return res.status(500).send(e.message);
        }
    }

    public async remove (req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            try {
                new Types.ObjectId(req.params.id);
            } catch (error) {
                return res.status(400).send("Not an ObjectId");
            }

            const item = await this.Model.findById(req.params.id);

            if (item) {
                await item.delete();
                return res.sendStatus(200);
            } else {
                return res.sendStatus(404);
            }
        } catch (e: any) {
            console.error(e);
            return res.status(500).send(e.message);
        }
    };
}

const createRouter = (crudRouter: CRUDRouter<typeof MongooseModel>) => {
    const router = express.Router();

    router.get('/', crudRouter.all.bind(crudRouter));
    router.get('/:id', crudRouter.get.bind(crudRouter));
    router.post('/', crudRouter.create.bind(crudRouter));
    router.put('/:id', crudRouter.update.bind(crudRouter));
    router.delete('/:id', crudRouter.remove.bind(crudRouter));

    return router;
};

export default { CRUDRouter, createRouter };
