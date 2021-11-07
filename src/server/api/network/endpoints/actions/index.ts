import wol from 'wol';
import {Request, Response, NextFunction} from "express";

import Endpoint from "../../../../data/models/network/Endpoint";
import {add} from "lodash";

const wake = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const endpoint = await Endpoint.findById(req.params.id);

        if (endpoint) {
            let address: String = "255.255.255.255"; // Broadcast address on a local network.
            if (endpoint.ip6) {
                address = endpoint.ip6;
            }
            if (endpoint.ip4) {
                address = endpoint.ip4;
            }

            const port = 7;
            console.log(`Waking up endpoint with a magic packet using address ${address}, port ${port}.`);

            try {
                const result = await wol.wake(endpoint.mac, {address, port});
                return res.status(200).send(result);
            } catch (err) {
                return res.sendStatus(500);
            }
        }
        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

export { wake };
