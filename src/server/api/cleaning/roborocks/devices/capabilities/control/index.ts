import {Request, Response, NextFunction} from "express";
import miio from "miio";
import _ from "lodash";

import Roborock from "../../../../../../data/models/cleaning/roborock/Roborock";

import CapabilitiesActionAssociation from "./CapabilitiesActionAssociation";
import CRONManager from "../../../../../../lib/api/CRONManager";

function generateDescription(action: any): string {
    if (action === "app_start") {
        return "Démarrer le nettoyage";
    }
    if (action === "app_stop") {
        return "Stopper le nettoyage";
    }
    if (action === "app_pause") {
        return "Pause du nettoyage";
    }
    if (action === "fanSpeed") {
        return "Modifier la vitesse";
    }
    return action;
}

const doAction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roborock = await Roborock.findById(req.params.id);

        const data = req.body.data;
        const action = req.body.action;
        const isAdvancedCommand = req.body.advancedCommand;

        if (roborock) {
            const device = await miio.device({address: roborock.ip, token: roborock.token});
            const deviceCapabilities = device.metadata.capabilities;
            const capabilityAssociation = _.get(CapabilitiesActionAssociation, action);

            if (_.isEmpty(capabilityAssociation)) {
                // Action unknown.
                return res.status(404).send("Unknown action");
            }

            const hasCapability = _.find(deviceCapabilities, capabilityAssociation) !== -1;

            if (hasCapability) {
                let resultAction;

                if (req.body.cronExpression) {
                    const args = {
                        action,
                        data,
                        isAdvancedCommand
                    };

                    if (_.isNil(args.data)) {
                        delete args.data;
                    }
                    if (_.isNil(args.action)) {
                        delete args.action
                    }
                    if (_.isNil(args.isAdvancedCommand)) {
                        delete args.isAdvancedCommand;
                    }

                    await CRONManager.addJob(
                        Roborock.modelName,
                        roborock._id,
                        req.body.cronExpression,
                        generateDescription(action),
                        req.originalUrl,
                        req.method,
                        args
                    );
                    return res.sendStatus(200);
                } else {
                    if (_.isUndefined(isAdvancedCommand) || !isAdvancedCommand) {
                        resultAction = await device.miioCall(action);
                    } else {
                        // Actions doesn't work with empty params so we need to differentiate them.
                        if (!_.isEmpty(data)) {
                            resultAction = await device[action](data);
                        } else {
                            resultAction = await device[action]();
                        }
                    }

                    // Express would send a warning if the result is an integer.
                    if (Number.isInteger(resultAction)) {
                        resultAction = resultAction.toString();
                    }

                    return res.status(200).send(resultAction);
                }
            }

            return res.sendStatus(401);
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

export default { doAction };
