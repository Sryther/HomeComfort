import dot from 'dotenv';
dot.config();

import _ from 'lodash';
import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const port = 3000;

const { API_HOST } = process.env;

if (_.isNil(API_HOST)) {
    process.env.API_HOST = `${document.location.origin.replace(/:[0-9]*/, "")}:3000`;
}

app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.use('/public', express.static('public'));

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});
