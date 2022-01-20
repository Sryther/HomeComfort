import CRUDRouting from "../../../lib/api/CRUDRouting";
import ActionsAPI from "./Actions";
import ViewSonic from "../../../data/models/video-projector/viewsonic/ViewSonic";

const router = CRUDRouting.createRouter(new CRUDRouting.CRUDRouter<typeof ViewSonic>(ViewSonic));

router.post("/:id/power-on", ActionsAPI.on);
router.post("/:id/power-off", ActionsAPI.off);
router.get("/:id/state", ActionsAPI.state);

export default router;
