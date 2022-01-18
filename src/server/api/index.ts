import express, { Router } from 'express';
import redoc from 'redoc-express';
import ExpressSwaggerGenerator from 'express-swagger-generator';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import getPackageVersion from '@jsbits/get-package-version'

import CleaningApi from './cleaning';
import LayoutsApi from './layouts';
import NetworkApi from './network';
import AirApi from './air';
import SchedulesApi from './schedules';
import ProjectionScreenApi from './projection-screen';
import VideoProjectorApi from './video-projector';

const App = express();
const router = Router();
const expressSwagger = ExpressSwaggerGenerator(App);

// Middlewares.
App.use(bodyParser.json());
App.use(morgan('tiny'));

// Sub routers.
router.use('/cleaning', CleaningApi);
router.use('/layouts', LayoutsApi);
router.use('/network', NetworkApi);
router.use('/air', AirApi);
router.use('/schedules', SchedulesApi);
router.use('/projection-screen', ProjectionScreenApi);
router.use('/video-projector', VideoProjectorApi);

// Final path.
App.use('/api', router);

// Documentation
let docOptions = {
    swaggerDefinition: {
        info: {
            description: 'Helix server',
            title: 'Helix',
            version: getPackageVersion(),
        },
        host: 'localhost:3000',
        basePath: '/',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https']
    },
    basedir: __dirname, // app absolute path
    files: ['./routes/**/*.js'] //Path to the API handle folder
};

expressSwagger(docOptions);

App.get(
    '/docs',
    redoc({
        title: 'API Docs',
        specUrl: '/api-docs.json'
    })
);

export default App;
