import CRUDRouting from "../../../lib/api/CRUDRouting";
import Map from "../../../data/models/layouts/Map";

const router = CRUDRouting.createRouter(new CRUDRouting.CRUDRouter<typeof Map>(Map));

export default router;
