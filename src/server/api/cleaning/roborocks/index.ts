import express from 'express';
import DevicesApi from './devices';
import * as miio from 'miio';

const router = express.Router();

router.use('/devices', DevicesApi);

router.get('/browse', async (req: any, res: any, next: any) => {
    try {
        const devices = miio.browse();

        res.status(200).send(devices);
    } catch (e) {
        return res.status(500).send(e);
    }
});

export default router;