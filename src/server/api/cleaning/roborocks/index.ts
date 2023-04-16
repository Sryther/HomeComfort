import * as express from 'express';
import * as miio from 'miio';
import {Request, Response, NextFunction} from "express";

import DevicesApi from './devices';

const router = express.Router();

router.use('/devices', DevicesApi);

router.get('/browse', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const devices = miio.browse();

        res.status(200).send(devices);
    } catch (e) {
        return res.status(500).send(e);
    }
});

export default router;
