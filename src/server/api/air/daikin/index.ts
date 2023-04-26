import CRUDRouting from "../../../lib/api/CRUDRouting";
import ActionsAPI from "./Actions";
import AirConditionner from "../../../data/models/air/daikin/AirConditionner";

const router = CRUDRouting.createRouter(new CRUDRouting.CRUDRouter<typeof AirConditionner>(AirConditionner));

router.post("/discover", ActionsAPI.discover);
router.get("/:id/information", ActionsAPI.getInformation);
router.put("/:id/set-values", ActionsAPI.setValues);
router.post("/:id/set-values", ActionsAPI.setValues);
router.post("/:id/leds", ActionsAPI.enableLEDs);

export default router;
