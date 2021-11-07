import express, { Router } from 'express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';

import CleaningApi from './cleaning';
import LayoutsApi from './layouts';
import NetworkApi from './network';
import AirApi from './air';

const App = express();
const router = Router();

// Middlewares.
App.use(bodyParser.json());
App.use(morgan('tiny'));

// Sub routers.
router.use('/cleaning', CleaningApi);
router.use('/layouts', LayoutsApi);
router.use('/network', NetworkApi);
router.use('/air', AirApi)

// Final path.
App.use('/api', router);

export default App;
