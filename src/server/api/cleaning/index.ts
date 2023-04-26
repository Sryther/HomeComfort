import * as express from 'express';

import RoborocksApi from "./roborocks";

const router = express.Router();

router.use('/roborocks', RoborocksApi);

export default router;
