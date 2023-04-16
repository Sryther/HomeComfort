import * as express from 'express';

import LumeneApi from './lumene';

const router = express.Router();

router.use('/lumene', LumeneApi);

export default router;
