import express, { Router } from 'express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';

import CleaningApi from './cleaning';

const App = express();
const router = Router();

// Middlewares.
App.use(bodyParser.json());
App.use(morgan('tiny'));

// Sub routers.
router.use('/cleaning', CleaningApi);

// Final path.
App.use('/api', router);

export default App;