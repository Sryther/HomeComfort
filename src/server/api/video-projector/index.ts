import * as express from 'express';

import ViewSonicApi from './viewsonic';

const router = express.Router();

router.use('/viewsonic', ViewSonicApi);

export default router;
