import {Request, Response, NextFunction} from "express";
import {DaikinAC, discover as Discover} from 'daikin-controller';

import DaikinAirCondtioner from "../../../data/models/air/daikin/AirConditionner";
import _ from "lodash";
import ACParams from "./ACParams";

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

        const acParams: ACParams = new ACParams();
        acParams.power = req.body.power;
        acParams.mode = req.body.mode;
        acParams.targetTemperature = req.body.targetTemperature;
        acParams.targetHumidity = req.body.targetHumidity;
        acParams.fanRate = req.body.fanRate;
        acParams.fanDirection = req.body.fanDirection;

        if (_.isEmpty(acParams.toObject())) {
            return res.status(400).send("No values given.");
        }

        if (ac) {
            try {
                const daikin = (await DaikinCreationCallbackWrapper(ac.ip4 || ac.ip6, options)).response;
                console.log(`Sending data to Daikin AC ${ac.name} (${ac.ip4 || ac.ip6}): ${JSON.stringify(acParams)}`);
                await DaikinCallbackWrapper(daikin, daikin.setACControlInfo, acParams.toObject());
                return res.sendStatus(200);
            } catch (error) {
                console.error(`Couldn't set values to Daikin AC ${ac.name} (${ac.ip4 || ac.ip6}): ${error}`);
                return res.sendStatus(500);
            }
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

const addSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ac = await DaikinAirCondtioner.findById(req.params.id);

        const acParams: ACParams = new ACParams();
        acParams.power = req.body.power;
        acParams.mode = req.body.mode;
        acParams.targetTemperature = req.body.targetTemperature;
        acParams.targetHumidity = req.body.targetHumidity;
        acParams.fanRate = req.body.fanRate;
        acParams.fanDirection = req.body.fanDirection;

        if (_.isEmpty(acParams.toObject())) {
            return res.status(400).send("No values given.");
        }

        if (ac) {
            try {
                const daikin = (await DaikinCreationCallbackWrapper(ac.ip4 || ac.ip6, options)).response;
                console.log(`Sending data to Daikin AC ${ac.name} (${ac.ip4 || ac.ip6}): ${JSON.stringify(acParams.toObject())}`);
                await DaikinCallbackWrapper(daikin, daikin.setACControlInfo, acParams.toObject());
                return res.sendStatus(200);
            } catch (error) {
                console.error(`Couldn't set values to Daikin AC ${ac.name} (${ac.ip4 || ac.ip6}): ${error}`);
                return res.sendStatus(500);
            }
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

export default { setValues, discover, getInformation };
