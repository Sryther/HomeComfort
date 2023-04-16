import CRUDRouting from "../../../lib/api/CRUDRouting";
import CompositionsCRUDRouter from "./CompositionsCRUD";

const router = CRUDRouting.createRouter(new CompositionsCRUDRouter());

export default router;
