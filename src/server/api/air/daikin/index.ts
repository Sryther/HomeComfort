import * as CRUD from "./DaikinAirConditionerCRUD";
import CRUDRouting from "../../../lib/api/CRUDRouting";
import ActionsAPI from "./Actions";

const router = CRUDRouting.createRouter(CRUD);

router.post("/discover", ActionsAPI.discover);
router.get("/:id/information", ActionsAPI.getInformation);
router.post("/:id/change-temperature", ActionsAPI.changeTemp);

export default router;
