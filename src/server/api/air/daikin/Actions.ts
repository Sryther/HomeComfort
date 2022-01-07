import {Request, Response, NextFunction} from "express";
import {DaikinAC, discover as Discover} from 'daikin-controller';
import * as CronValidator from 'cron-validator';

import DaikinAirCondtioner from "../../../data/models/air/daikin/AirConditionner";
import _ from "lodash";
import ACParams from "./ACParams";
import CRONManager from "../../../lib/api/CRONManager";
import path from "path";
import DaikinAirConditionner from "../../../data/models/air/daikin/AirConditionner";
import {de} from "cronstrue/dist/i18n/locales/de";

const options = {
    useGetToPost: true
};

const DaikinCreationCallbackWrapper = (...args: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        const daikin = new DaikinAC(...args, (err: string, ret: string, response: any) => {
            if (err) {
                return reject(err);
            }

            return resolve({
                "ret": ret,
                "response": daikin
            });
        });
    });
}

const DaikinCallbackWrapper = (daikinInstance: any, method: any, ...args: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        args.push((err: string, ret: string, response: any) => {
            if (err) {
                return reject(err);
            }

            return resolve({
                "ret": ret,
                "response": response
            });
        });
        method.apply(daikinInstance, args);
    });
}

const discover = async (req: Request, res: Response, next: NextFunction) => {
    // Not actually working
    const numberOfDevices = req.body.numberOfDevices;
    if (!numberOfDevices) {
        return res.sendStatus(400);
    }

    const result = await Discover(numberOfDevices);
    return res.send(result);
};

const getInformation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ac = await DaikinAirCondtioner.findById(req.params.id);

        if (ac) {
            try {
                const daikin = (await DaikinCreationCallbackWrapper(ac.ip4 || ac.ip6, options)).response;
                const information = await DaikinCallbackWrapper(daikin, daikin.getCommonBasicInfo);
                const acControl = await DaikinCallbackWrapper(daikin, daikin.getACControlInfo);
                const acSensor = await DaikinCallbackWrapper(daikin, daikin.getACSensorInfo);
                const acModel = await DaikinCallbackWrapper(daikin, daikin.getACModelInfo);
                const acWeekPower = await DaikinCallbackWrapper(daikin, daikin.getACWeekPower);
                const acYearPower = await DaikinCallbackWrapper(daikin, daikin.getACYearPower);

                return res.status(200).send({
                    commonBasic: information.ret,
                    acControl: acControl.ret,
                    acSensor: acSensor.ret,
                    acModel: acModel.ret,
                    acWeekPower: acWeekPower.ret,
                    acYearPower: acYearPower.ret
                });
            } catch (error) {
                console.error(`Couldn't retrieve all the data from Dakin AC ${ac.name} (${ac.ip4 || ac.ip6}): ${error}`);
                return res.sendStatus(500);
            }
        } else {
            return res.sendStatus(404);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};

const setValues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ac = await DaikinAirCondtioner.findById(req.params.id);
        const acParams = getValuesFromBody(req);

        if (_.isEmpty(acParams.toObject())) {
            return res.status(400).send("No values given.");
        }

        if (ac) {
            try {
                if (req.body.cronExpression) {
                    await CRONManager.addJob(
                        DaikinAirConditionner.modelName,
                        ac._id,
                        req.body.cronExpression,
                        generateDescription(acParams.toObject()),
                        req.originalUrl,
                        req.method,
                        acParams.toObject()
                    );
                } else {
                    await setValuesRaw(req.params.id, acParams);
                }
                return res.sendStatus(200);
            } catch (error) {
                console.error(`Couldn't set values to Daikin AC ${ac.name} (${ac.ip4 || ac.ip6})`, error);
                return res.sendStatus(500);
            }
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const setValuesRaw = async (id: string, acParams: ACParams): Promise<any> => {
    const ac = await DaikinAirCondtioner.findById(id);

    if (ac) {
        const daikin = (await DaikinCreationCallbackWrapper(ac.ip4 || ac.ip6, options)).response;
        console.log(`Sending data to Daikin AC ${ac.name} (${ac.ip4 || ac.ip6}): ${JSON.stringify(acParams)}`);
        await DaikinCallbackWrapper(daikin, daikin.setACControlInfo, acParams.toObject());
    }
}

const getValuesFromBody = (req: Request) => {
    const acParams: ACParams = new ACParams();
    acParams.power = req.body.power;
    acParams.mode = req.body.mode;
    acParams.targetTemperature = req.body.targetTemperature;
    acParams.targetHumidity = req.body.targetHumidity;
    acParams.fanRate = req.body.fanRate;
    acParams.fanDirection = req.body.fanDirection;

    return acParams;
}

const generateDescription = (acParams: ACParams): string => {
    const descriptions = [];
    if (!_.isNil(acParams.power)) {
        descriptions.push(`Alimentation : ${humanizePower(acParams.power)}`);
    }

    if (!_.isNil(acParams.mode)) {
        descriptions.push(`Mode : ${humanizeMode(acParams.mode)}`);
    }

    if (!_.isNil(acParams.targetTemperature)) {
        descriptions.push(`Température voulue : ${acParams.targetTemperature}`);
    }

    if (!_.isNil(acParams.fanRate)) {
        descriptions.push(`Ventilation : ${acParams.fanRate}`);
    }

    if (!_.isNil(acParams.fanDirection)) {
        descriptions.push(`Direction ventilation : ${acParams.fanDirection}`);
    }

    if (!_.isNil(acParams.targetHumidity)) {
        descriptions.push(`Humidité voulue : ${acParams.targetHumidity}`);
    }

    if (_.isEmpty(descriptions)) {
        descriptions.push("Rien");
    }

    return descriptions.join("\n");
}

const humanizePower = (power: Boolean | null): string => {
    if (power) {
        return "allumé";
    }
    return "éteint";
}

const humanizeMode = (mode: Number | null): string => {
    if (mode === 1) {
        return "1";
    }
    if (mode === 2) {
        return "2";
    }
    if (mode === 3) {
        return "3";
    }
    if (mode === 4) {
        return "4";
    }
    return mode + "";
}

export default { setValues, discover, getInformation, setValuesRaw };
