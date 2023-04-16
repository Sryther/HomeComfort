import * as express from "express";
import Bridge from "../../../data/models/light/hue/Bridge";
import * as Actions from "./actions";
import CRUDRouting from "../../../lib/api/CRUDRouting";

const bridgeRouter = express.Router();
bridgeRouter.get('/discover', Actions.discoverBridge);
bridgeRouter.get('/:id/configuration', Actions.getBridgeConfiguration);

const lightRouter = express.Router({mergeParams: true});
lightRouter.get("/", Actions.getLights);
lightRouter.get("/:id", Actions.getLight);
lightRouter.get("/:id/state", Actions.getLightState);
lightRouter.post("/:id/state", Actions.setLightState);

bridgeRouter.use('/:idBridge/light', lightRouter);

CRUDRouting.createRouter(new CRUDRouting.CRUDRouter<typeof Bridge>(Bridge), bridgeRouter);
const mainRouter = express.Router();

mainRouter.use('/bridge', bridgeRouter);

export default mainRouter;
