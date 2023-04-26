import {NextFunction, Request, Response} from "express";
import {DaikinAC, discover as Discover} from 'daikin-controller';

import DaikinAirConditioner, {DaikinAirConditionerDocument} from "../../../data/models/air/daikin/AirConditionner";
import _ from "lodash";
import ACParams from "./ACParams";
import CRONManager from "../../../lib/api/CRONManager";

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
        try {
            if (_.isNull(args)) {
                args = [];
            }

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
        } catch(e: any) {
            return reject(e);
        }
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

const findKey = (object: any, value: any) => {
    return _.findKey(object, (item) => (item === value));
}

const findValue = (object: any, key: any) => {
    return object[key];
}

const formatControl = (acControl: any) => {
    acControl.mode = findKey(DaikinAC.Mode, acControl.mode);
    acControl.specialMode = findKey(DaikinAC.SpecialModeResponse, acControl.specialMode);
    acControl.fanDirection = findKey(DaikinAC.FanDirection, acControl.fanDirection);
    acControl.fanRate = findKey(DaikinAC.FanRate, acControl.fanRate);
    return acControl;
}

const formatControlToSend = (acControl: ACParams) => {
    acControl.mode = findValue(DaikinAC.Mode, acControl.mode);
    acControl.specialMode = findValue(DaikinAC.SpecialModeKind, acControl.specialMode);
    acControl.specialModeActive = !!acControl.specialModeActive;
    acControl.fanDirection = findValue(DaikinAC.FanDirection, acControl.fanDirection);
    acControl.fanRate = findValue(DaikinAC.FanRate, acControl.fanRate);
    return acControl;
}

const getInformation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ac = await DaikinAirConditioner.findById(req.params.id);

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
                    acControl: formatControl(acControl.ret),
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
        const ac: DaikinAirConditionerDocument | null = await DaikinAirConditioner.findById(req.params.id);
        const acParams: ACParams = formatControlToSend(getValuesFromBody(req));
        if (_.isEmpty(acParams.toObject())) {
            return res.status(400).send("No values given.");
        }

        if (ac) {
            try {
                if (req.body.cronExpression) {
                    await CRONManager.addJob(
                        DaikinAirConditioner.modelName,
                        ac._id,
                        req.body.cronExpression,
                        generateDescription(acParams.toObject()),
                        req.originalUrl,
                        req.method,
                        acParams.toObject()
                    );
                } else {
                    let result;
                    if (!_.isNil(acParams.specialMode)) {
                        result = await setSpecialMode(req.params.id, acParams.specialMode, acParams.specialModeActive);
                    } else {
                        result = await setValuesRaw(req.params.id, acParams);
                    }
                    return res.status(200).send(result);
                }
                return res.sendStatus(202);
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
    const ac: DaikinAirConditionerDocument | null = await DaikinAirConditioner.findById(id);

    if (ac) {
        const daikin = (await DaikinCreationCallbackWrapper(ac.ip4 || ac.ip6, options)).response;
        console.log(`Sending data to Daikin AC ${ac.name} (${ac.ip4 || ac.ip6}): ${JSON.stringify(acParams.toObject())}`);
        return await DaikinCallbackWrapper(daikin, daikin.setACControlInfo, acParams.toObject());
    }
}

const setSpecialMode = async (id: String, specialMode: any, state: any): Promise<any> => {
    const ac: DaikinAirConditionerDocument | null = await DaikinAirConditioner.findById(id);

    if (ac) {
        const daikin = (await DaikinCreationCallbackWrapper(ac.ip4 || ac.ip6, options)).response;
        console.log(`Sending special mode to Daikin AC ${ac.name} (${ac.ip4 || ac.ip6}): ${specialMode}`);
        const args = {
            state: state ? 1 : 0,
            kind: parseInt(specialMode)
        };
        const result = await DaikinCallbackWrapper(daikin, daikin.setACSpecialMode, args);

        await DaikinCallbackWrapper(daikin, daikin.setUpdate, 1000, () => {}); // See https://github.com/Apollon77/daikin-controller/issues/120

        return result;
    }
}

const getValuesFromBody = (req: Request) => {
    const acParams: ACParams = new ACParams();
    acParams.power = req.body.power;
    acParams.mode = req.body.mode;
    acParams.specialMode = req.body.specialMode;
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

const humanizeMode = (mode: Number | String | null): string => {
    if (_.isNull(mode)) {
        return "";
    }
    const intMode = parseInt(mode.toString());
    if (intMode === 1) {
        return "1";
    }
    if (intMode === 2) {
        return "2";
    }
    if (intMode === 3) {
        return "3";
    }
    if (intMode === 4) {
        return "4";
    }
    return intMode + "";
}

const enableLEDs = async (req: Request, res: Response, next: NextFunction) => {
    const isEnabled = req.body.enabled;
    const ac: DaikinAirConditionerDocument | null = await DaikinAirConditioner.findById(req.params.id);

    if (ac) {
        try {
            if (req.body.cronExpression) {
                await CRONManager.addJob(
                    DaikinAirConditioner.modelName,
                    ac._id,
                    req.body.cronExpression,
                    isEnabled ? "Activation des LEDs" : "Désactivation des LEDs",
                    req.originalUrl,
                    req.method,
                    {enabled: isEnabled}
                );
                return res.sendStatus(202);
            } else {
                const daikin = (await DaikinCreationCallbackWrapper(ac.ip4 || ac.ip6, options)).response;
                console.log(`Enabling/disabling LEDs for Daikin AC ${ac.name} (${ac.ip4 || ac.ip6}): ${isEnabled}`);
                const methodToInvoke = isEnabled ? daikin.enableAdapterLED : daikin.disableAdapterLED
                const result = await DaikinCallbackWrapper(daikin, methodToInvoke);

                return res.status(200).send(result);
            }
        } catch (error) {
            console.error(`Couldn't enable/disable LEDs for Daikin AC ${ac.name} (${ac.ip4 || ac.ip6})`, error);
            return res.sendStatus(500);
        }
    }
}

export default { setValues, discover, getInformation, setValuesRaw, enableLEDs };
