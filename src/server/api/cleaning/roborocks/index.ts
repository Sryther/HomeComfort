import express from 'express';
import Roborock from "../../../data/models/Roborock";

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const roborocks = await Roborock.find();
        return res.status(200).send(roborocks);
    } catch (e) {
        return res.status(500).send(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const roborock = await Roborock.findById(req.params.id);

        if (roborock) {
            return res.status(200).send(roborock);
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
});

router.post('/', async (req, res, next) => {
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
});

router.delete('/:id', async (req, res, next) => {
    try {
        const result = await Roborock.findById(req.params.id);

        if (result) {
            await result.delete();
            return res.sendStatus(200);
        } else {
            return res.sendStatus(404);
        }
    } catch (e) {
        return res.status(500).send(e);
    }
});

export default router;