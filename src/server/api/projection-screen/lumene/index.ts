import CRUDRouting from "../../../lib/api/CRUDRouting";
import ActionsAPI from "./Actions";
import Lumene from "../../../data/models/projection-screen/lumene/Lumene";

const router = CRUDRouting.createRouter(new CRUDRouting.CRUDRouter<typeof Lumene>(Lumene));

router.post("/:id/up", ActionsAPI.up);
router.get("/:id/down", ActionsAPI.down);

export default router;
