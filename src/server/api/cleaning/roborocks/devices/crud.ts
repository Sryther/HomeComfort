import Roborock from "../../../../data/models/Roborock";

const all = async (req: any, res: any, next: any) => {
    try {
        const roborocks = await Roborock.find();
        return res.status(200).send(roborocks);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const get = async (req: any, res: any, next: any) => {
    try {
        const roborock = await Roborock.findById(req.params.id);

        if (roborock) {
            return res.status(200).send(roborock);
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const create = async (req: any, res: any, next: any) => {
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
};

const remove = async (req: any, res: any, next: any) => {
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
};

export { create, all, get, remove };