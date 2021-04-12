import Api from './api';
import Config from './config';
import { getRoutes } from './debug';
import mongoose from './data/database-instance';

import { AddressInfo } from 'net';

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to mongodb');
});

const server = Api.listen(Config.api.port, 'localhost', () => {
    const {port, address} = server.address() as AddressInfo;

    console.log('Server listening on:', `http://${address}:${port}`);
});

console.log(getRoutes(Api));