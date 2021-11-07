import {Request, Response, NextFunction} from "express";
import {DaikinAC, discover as Discover} from 'daikin-controller';

import DaikinAirCondtioner from "../../../data/models/air/daikin/AirConditionner";

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
                console.log(information);
                return res.status(200).send(information);
            } catch (error) {
                console.log(error)
                return res.sendStatus(500);
            }
        } else {
            return res.sendStatus(404);
        }
    } catch (error) {
        return res.status(500).send(error);
    }
};

const changeTemp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ac = await DaikinAirCondtioner.findById(req.params.id);

        if (ac) {
            const daikin = new DaikinAC(ac.ip4 || ac.ip6, options, function(err: any) {
                // will be called after successfull initialization

                // daikin.currentCommonBasicInfo - contains automatically requested basic device data
                // daikin.currentACModelInfo - contains automatically requested device model data

                daikin.setUpdate(1000, function(err: any) {
                    // method to call after each update
                    // daikin.currentACControlInfo - contains control data from device updated on defined interval
                    // daikin.currentACSensorInfo - contains sensor data from device updated on defined interval
                });

            });
        }

        return res.sendStatus(404);
    } catch (e) {
        return res.status(500).send(e);
    }
};

export default { changeTemp, discover, getInformation };
