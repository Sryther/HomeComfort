import express, { Router } from 'express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';

import CleaningApi from './cleaning';

const App = express();
const router = Router();

App.use(bodyParser.json({
    limit: '50mb',
    verify(req: any, res, buf, encoding) {
        req.rawBody = buf;
    }
}));

App.use(morgan('tiny'));

router.get('/', (req, res) => res.send('Hello World!'));
router.use('/cleaning', CleaningApi);

App.use('/api', router);

export default App;