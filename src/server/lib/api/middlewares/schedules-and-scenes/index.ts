import CRONManager from "../../CRONManager";
import {NextFunction, Request, Response} from "express";
// @ts-ignore
import _ from "lodash";

import Scene from "../../../../data/models/scene/Scene";
import {ActionDocument} from "../../../../data/models/action/Action";
import {de} from "cronstrue/dist/i18n/locales/de";

const schedulesAndScenesInterceptor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const params = Object.assign({}, req.body);
        delete params.cronExpression;

        if (req.body.cronExpression) {
            const schedule = await CRONManager.addJob(
                "TODO",
                req.params.id,
                req.body.cronExpression,
                "TODO",
                req.originalUrl,
                req.method,
                params
            );

            return res.status(200).send(schedule);
        } else if (req.body.sceneId) {
            const scene = await Scene.findById(req.body.sceneId);

            if (scene) {
                if (_.isNil(scene.actions)) {
                    scene.actions = [];
                }

                delete params.sceneId;

                let nextOrder = scene.actions.length;
                if (params.order) {
                    nextOrder = params.order;
                    delete params.order;
                }
                let deviceId = "";
                const matcherDeviceId = req.originalUrl.match("[0-9a-fA-F]{24}");
                if (matcherDeviceId !== null && matcherDeviceId.length > 0) {
                    deviceId = matcherDeviceId[0];
                }

                const action: ActionDocument = {
                    deviceId: deviceId,
                    deviceType: "",
                    httpVerb: req.method,
                    route: req.originalUrl,
                    order: nextOrder
                };

                if (params.description) {
                    action.description = params.description;
                    delete params.description;
                }

                action.args = params;

                scene.actions.push(action);

                await scene.save();

                return res.status(200).send(scene);
            } else {
                return res.sendStatus(404);
            }
        }

        next();
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

export default schedulesAndScenesInterceptor;
