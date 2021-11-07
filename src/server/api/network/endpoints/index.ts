import * as CRUD from "./NetworkEndpointsCRUD";

import * as Actions from "./actions";
import CRUDRouting from "../../../lib/api/CRUDRouting";

const router = CRUDRouting.createRouter(CRUD);

router.post('/:id/wake', Actions.wake);

export default router;
