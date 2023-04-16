import * as express from 'express';
import EndpointsApi from './endpoints';

const router = express.Router();

router.use('/endpoints', EndpointsApi);

export default router;
