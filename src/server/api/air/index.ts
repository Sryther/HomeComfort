import * as express from "express";

import DaikinApi from "./daikin";

const router = express.Router();

router.use('/daikin', DaikinApi);

export default router;
