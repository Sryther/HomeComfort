import Endpoint from "../../../data/models/network/Endpoint"
import * as Actions from "./actions";
import CRUDRouting from "../../../lib/api/CRUDRouting";

const router = CRUDRouting.createRouter(new CRUDRouting.CRUDRouter<typeof Endpoint>(Endpoint));

router.post('/:id/wake', Actions.wake);

export default router;
