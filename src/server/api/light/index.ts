import * as express from 'express';
import HueApi from './hue';

const router = express.Router();

router.use('/hue', HueApi);

export default router;
