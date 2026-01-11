import Api from './api';
import Config from './config';
import { getRoutes } from './debug';
import mongoose from './data/database-instance';

import { AddressInfo } from 'net';
import CRONManager from "./lib/api/CRONManager";

const db = mongoose.connection;
db.on("connected", () => console.log("[Mongo] connected"));
db.on("disconnected", () => console.log("[Mongo] disconnected"));
db.on("reconnected", () => console.log("[Mongo] reconnected"));
db.on("error", (err) => console.error("[Mongo] error", err));
db.once('open', () => {
    console.log('[Mongo] Connected!');

    const server = Api.listen(Config.api.port, Config.api.hostname, async () => {
        const {port, address} = server.address() as AddressInfo;

        console.log(`Server listening on: http://${address}:${port}`);
        console.log(`Online documentation available on http://${address}:${port}/docs`);

        console.log(getRoutes(Api));

        console.log(`Waking up scheduled tasks.`);
        await CRONManager.launchJobs();
    });
});
