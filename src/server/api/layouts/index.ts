import * as express from 'express';

import MapsAPI from "./maps";
import CompositionsAPI from "./compositions";

const router = express.Router();

router.use("/maps", MapsAPI);
router.use("/compositions", CompositionsAPI);

export default router;
