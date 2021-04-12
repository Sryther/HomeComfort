import Roborock from "../../../../../data/models/Roborock";
import miio from "miio";
import axios from "axios";
import XiaomiService from "../../../../../lib/xiaomi/service/XiaomiService";

const getMap = async (req: any, res: any, next: any) => {
    try {
        const roborock = await Roborock.findById(req.params.id);

        if (roborock) {
            const xiaomiService = new XiaomiService(req.query.username, req.query.password);
            const map = await xiaomiService.getMap(roborock);

            return res.status(200).send(map);
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};



export default { getMap };