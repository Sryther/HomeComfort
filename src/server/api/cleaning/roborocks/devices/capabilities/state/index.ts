import Roborock from "../../../../../../data/models/Roborock";
import miio from "miio";

const getState = async (req: any, res: any, next: any) => {
    try {
        const roborock = await Roborock.findById(req.params.id);

        if (roborock) {
            const device = await miio.device({ address: roborock.ip, token: roborock.token });

            return res.status(200).json(await device.state());
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const getSpecificState = async (req: any, res: any, next: any) => {
    try {
        const roborock = await Roborock.findById(req.params.id);
        const params = req.params.data;

        if (roborock) {
            const device = await miio.device({ address: roborock.ip, token: roborock.token });
            const result = await device.state();

            return res.status(200).send(result[params].toString());
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

export default { getState, getSpecificState };