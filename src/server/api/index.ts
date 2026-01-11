import express, { Router } from 'express';
import redoc from 'redoc-express';
import ExpressSwaggerGenerator from 'express-swagger-generator';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import getPackageVersion from '@jsbits/get-package-version'

import AirApi from './air';
import CleaningApi from './cleaning';
import EventApi from './event';
import LayoutsApi from './layouts';
import LightApi from './light';
import NetworkApi from './network';
import SceneApi from './scene';
import SchedulesApi from './schedule';
import ProjectionScreenApi from './projection-screen';
import VideoProjectorApi from './video-projector';
import schedulesAndScenesInterceptor from "../lib/api/middlewares/schedules-and-scenes";
import addPropertiesToRequestInterceptor from "../lib/api/middlewares/add-properties-to-request";
import saveEventsInterceptor from "../lib/api/middlewares/save-events";

const App = express();
const router = Router();
const expressSwagger = ExpressSwaggerGenerator(App);

// Middlewares.
App.use(cors());
App.use(bodyParser.json());
App.use(morgan('tiny'));
App.use(addPropertiesToRequestInterceptor);
App.use(saveEventsInterceptor);
App.use(schedulesAndScenesInterceptor);

// Sub routers.
router.use('/air', AirApi);
router.use('/cleaning', CleaningApi);
router.use('/event', EventApi);
router.use('/layouts', LayoutsApi);
router.use('/light', LightApi);
router.use('/network', NetworkApi);
router.use('/scene', SceneApi);
router.use('/schedule', SchedulesApi);
router.use('/projection-screen', ProjectionScreenApi);
router.use('/video-projector', VideoProjectorApi);

// Final path.
App.use('/api', router);

// Logs when requests arrive and when they're done.
App.use((req, res, next) => {
    const start = Date.now();
    console.log(`[REQ] ${req.method} ${req.originalUrl}`);
    res.on("finish", () => {
        console.log(`[RES] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`);
    });
    next();
});

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
