import Api from './api';
import Config from './config';
import { getRoutes } from './debug';
import mongoose from './data/database-instance';

import { AddressInfo } from 'net';
import CRONManager from "./lib/api/CRONManager";

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to mongodb!');

    const server = Api.listen(Config.api.port, 'localhost', async () => {
        const {port, address} = server.address() as AddressInfo;

        console.log(`Server listening on: http://${address}:${port}`);
        console.log(`Online documentation available on http://${address}:${port}/docs`);

        console.log(getRoutes(Api));

        console.log(`Waking up scheduled tasks.`);
        await CRONManager.launchJobs();
    });
});
