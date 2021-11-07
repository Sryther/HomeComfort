import * as express from "express";
import {Request, Response, NextFunction} from "express";

interface ICRUD {
    get (req: Request, res: Response, next: NextFunction): any;
    all (req: Request, res: Response, next: NextFunction): any;
    create (req: Request, res: Response, next: NextFunction): any;
    update (req: Request, res: Response, next: NextFunction): any;
    remove (req: Request, res: Response, next: NextFunction): any;
}

const createRouter = (CRUD: ICRUD) => {
    const router = express.Router();

    router.get('/', CRUD.all);
    router.get('/:id', CRUD.get);
    router.post('/', CRUD.create);
    router.put('/:id', CRUD.update);
    router.delete('/:id', CRUD.remove);
    return router;
};

export default { createRouter };
