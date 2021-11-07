import {Request, Response, NextFunction} from "express";
import miio from "miio";
import _ from "lodash";

import Roborock from "../../../../../../data/models/cleaning/roborock/Roborock";

import CapabilitiesActionAssociation from "./CapabilitiesActionAssociation";

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

            return res.sendStatus(401);
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

export default { doAction };
