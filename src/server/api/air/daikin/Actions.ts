import {NextFunction, Request, Response} from "express";
import {DaikinAC, discover as Discover} from 'daikin-controller';

import DaikinAirConditioner, {DaikinAirConditionerDocument} from "../../../data/models/air/daikin/AirConditionner";
import _ from "lodash";
import {ACParams} from "./ACParams";
import CRONManager from "../../../lib/api/CRONManager";

const options = {
    useGetToPost: true
};

/**
 * A wrapper function for creating and initializing an instance of the DaikinAC class with a callback interface.
 * This function simplifies the callback-based initialization process by returning a Promise.
 *
 * @param {...any} args - Arguments passed to the DaikinAC constructor.
 * @returns {Promise<any>} A Promise that resolves to an object containing the result (`ret`) and the DaikinAC instance (`response`),
 *                         or rejects with an error message if initialization fails.
 */
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

/**
 * A wrapper function that converts a Daikin API callback-based method into a Promise-based method.
 *
 * @param {any} daikinInstance - The instance of the Daikin device or API object being invoked.
 * @param {any} method - The method from the Daikin API that needs to be invoked.
 * @param {...any[]} args - Additional arguments to pass to the method being invoked.
 * @returns {Promise<any>} A Promise that resolves with an object containing the "ret" and "response" values
 *                         or rejects with an error if the operation fails.
 */
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

/**
 * Handles the discovery process for devices by accepting the number of devices from the request body,
 * initiating a discovery operation, and returning the results.
 *
 * @param {Request} req - The HTTP request object containing the number of devices in its body.
 * @param {Response} res - The HTTP response object used to return the discovery results or error status.
 * @param {NextFunction} next - The next middleware function in the Express.js request-response cycle.
 * @returns {Promise<Response>} A Promise that resolves to an HTTP response with the discovery results or an error status.
 */
const discover = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    // Not actually working
    const numberOfDevices = req.body.numberOfDevices;
    if (!numberOfDevices) {
        return res.sendStatus(400);
    }

    const result = await Discover(numberOfDevices);
    return res.send(result);
};

/**
 * Searches an object for the first key that corresponds to a given value.
 *
 * @param {Object} object - The object to search through.
 * @param {*} value - The value to find the key for.
 * @returns {string|undefined} - Returns the key corresponding to the given value,
 * or `undefined` if no matching key is found.
 */
const findKey = (object: any, value: any): string | undefined => {
    return _.findKey(object, (item) => (item === value));
}

/**
 * Retrieves the value corresponding to the specified key from the given object.
 *
 * @param {object} object - The object from which to retrieve the value.
 * @param {string|number|symbol} key - The key whose corresponding value needs to be found.
 * @returns {*} The value associated with the specified key in the object.
 *              Returns undefined if the key does not exist in the object.
 */
const findValue = (object: any, key: any): any => {
    return object[key];
}

/**
 * Adjusts and formats the given air conditioner control object by mapping its properties
 * to corresponding keys in predefined enumerations.
 *
 * @param {any} acControl - The air conditioner control object containing properties
 * such as `mode`, `specialMode`, `fanDirection`, and `fanRate`.
 * These properties will be updated to match the associated keys in predefined enums.
 * @returns {any} The updated air conditioner control object, with formatted property values.
 */
const formatControl = (acControl: any) : any => {
    acControl.mode = findKey(DaikinAC.Mode, acControl.mode);
    acControl.specialMode = findKey(DaikinAC.SpecialModeResponse, acControl.specialMode);
    acControl.fanDirection = findKey(DaikinAC.FanDirection, acControl.fanDirection);
    acControl.fanRate = findKey(DaikinAC.FanRate, acControl.fanRate);
    return acControl;
}

/**
 * Processes and transforms an air conditioner (AC) control object by mapping its properties
 * to predefined values and normalizing certain attributes as needed.
 *
 * @param {ACParams} acControl - The AC control parameters to be transformed.
 * The object contains properties such as mode, specialMode, specialModeActive, fanDirection,
 * and fanRate that define the state and configuration of the AC unit.
 *
 * @returns {ACParams} - The transformed AC control parameters after normalization and mapping
 * to predefined values.
 */
const formatControlToSend = (acControl: ACParams) => {
    acControl.mode = findValue(DaikinAC.Mode, acControl.mode);
    acControl.specialMode = findValue(DaikinAC.SpecialModeKind, acControl.specialMode);
    acControl.specialModeActive = !!acControl.specialModeActive;
    acControl.fanDirection = findValue(DaikinAC.FanDirection, acControl.fanDirection);
    acControl.fanRate = findValue(DaikinAC.FanRate, acControl.fanRate);
    return acControl;
}

/**
 * Asynchronous function to retrieve information about a Daikin Air Conditioner.
 *
 * This handler is responsible for fetching air conditioner data based on the ID provided
 * in the request parameters. It leverages a series of utility functions to gather various
 * pieces of information from the air conditioner's API, including common basic info, control
 * info, sensor data, model details, and power usage statistics.
 *
 * If the air conditioner with the specified ID is not found in the database, a 404 HTTP
 * status code is returned. If an error occurs while retrieving data, a 500 status code is
 * returned.
 *
 * @param {Request} req - The Express request object, expected to contain air conditioner ID in `req.params.id`.
 * @param {Response} res - The Express response object used to send the HTTP response.
 * @param {NextFunction} next - The Express next middleware function (not used in this handler).
 * @returns {Promise<Response>} A promise that resolves with the HTTP response containing the air conditioner's
 *                              information or an error status code.
 */
const getInformation = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
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

/**
 * Handles the process of updating the settings for a specific Daikin air conditioner.
 *
 * @async
 * @function setValues
 * @param {Request} req - Express request object containing the details of the operation, including the air conditioner's ID and desired parameters in the request body.
 * @param {Response} res - Express response object used to communicate the outcome of the operation back to the client.
 * @param {NextFunction} next - Express next middleware function to pass control to the next middleware if necessary.
 * @returns {Promise<Response>} A promise that resolves to an Express `Response` object, indicating the status and result of the operation.
 *
 * @throws Will handle and return errors if issues occur during the operation. This includes:
 * - Returning a 400 status if no valid parameters are provided in the request body.
 * - Returning a 404 status if the specified air conditioner is not found.
 * - Catching and logging unexpected errors, returning a 500 status when applicable.
 *
 * The function performs the following operations:
 * 1. Finds the Daikin air conditioner document using the ID provided in the request parameters.
 * 2. Formats and validates the input parameters using helper functions.
 * 3. If a cron expression is included in the request body, a new job is scheduled via `CRONManager`.
 * 4. If a special mode is specified, applies the settings for the special mode.
 * 5. If standard parameters are specified, updates the air conditioner settings directly.
 * 6. Returns relevant HTTP responses to indicate success (200 or 202) or errors (400, 404, 500).
 */
const setValues = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
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

/**
 * Updates the raw values for a Daikin air conditioner by communicating with the device over its network address.
 *
 * @async
 * @function setValuesRaw
 * @param {string} id - The unique identifier of the air conditioner in the database.
 * @param {ACParams} acParams - The parameters to update the air conditioner's state, encapsulated in an ACParams object.
 * @returns {Promise<any>} A promise that resolves with the result of the data transmission or operation.
 * @throws {Error} Throws an error if the air conditioner cannot be located by the given ID or if there are issues during communication.
 */
const setValuesRaw = async (id: string, acParams: ACParams): Promise<any> => {
    const ac: DaikinAirConditionerDocument | null = await DaikinAirConditioner.findById(id);

    if (ac) {
        const daikin = (await DaikinCreationCallbackWrapper(ac.ip4 || ac.ip6, options)).response;
        console.log(`Sending data to Daikin AC ${ac.name} (${ac.ip4 || ac.ip6}): ${JSON.stringify(acParams.toObject())}`);
        return await DaikinCallbackWrapper(daikin, daikin.setACControlInfo, acParams.toObject());
    }
}

/**
 * Sets a special mode on a Daikin air conditioner by updating its state and mode parameters.
 *
 * @async
 * @function setSpecialMode
 * @param {String} id - The unique identifier of the Daikin air conditioner.
 * @param {any} specialMode - The special mode value to be sent to the air conditioner.
 * @param {any} state - The state to set for the special mode (e.g., enabled or disabled).
 * @returns {Promise<any>} A promise that resolves with the result of the operation, or rejects with an error.
 * @throws {Error} If the air conditioner cannot be found or if setting the special mode encounters an issue.
 */
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

/**
 * Extracts and maps values from the request body to an instance of the ACParams object.
 *
 * @param {Request} req - The HTTP request object containing the body with AC parameter values.
 * @returns {ACParams} An instance of ACParams populated with values extracted from the request body.
 */
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

/**
 * Generates a descriptive string based on the provided air conditioner (AC) parameters.
 *
 * This function takes an object containing various AC parameters, such as power, mode, target temperature,
 * fan rate, fan direction, and target humidity. It constructs a human-readable description for each parameter
 * that is defined and returns the result as a single, formatted string. If no parameters are defined, it returns
 * "Rien" as the description.
 *
 * @param {ACParams} acParams - An object containing the air conditioner parameters.
 *   - {number} [acParams.power] - The power level of the AC.
 *   - {string} [acParams.mode] - The operational mode of the AC.
 *   - {number} [acParams.targetTemperature] - The desired target temperature.
 *   - {string} [acParams.fanRate] - The fan speed or rate of the AC.
 *   - {string} [acParams.fanDirection] - The direction of the fan airflow.
 *   - {number} [acParams.targetHumidity] - The desired target humidity level.
 * @returns {string} A formatted string describing the defined parameters, or "Rien" if no parameters are defined.
 */
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

/**
 * Converts a power state value to its human-readable representation.
 *
 * @param {Boolean | null} power - The power state to be converted.
 *        If true, it represents "on" (allumé).
 *        If false or null, it represents "off" (éteint).
 * @returns {string} A string representation of the power state.
 *          Returns "allumé" if power is true,
 *          otherwise returns "éteint".
 */
const humanizePower = (power: Boolean | null): string => {
    if (power) {
        return "allumé";
    }
    return "éteint";
}

/**
 * Transforms the given mode into a human-readable string representation.
 *
 * @param {Number | String | null} mode - The input mode to be transformed.
 *        If the value is null, an empty string is returned.
 *        Otherwise, the mode is converted to an integer and matched to specific outputs.
 * @returns {string} Human-readable string representation of the mode.
 *          Returns an empty string if the mode is null or the
 *          stringified integer representation otherwise.
 */
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

/**
 * Handles enabling or disabling of the LEDs for a Daikin air conditioner.
 *
 * This function processes a HTTP request to toggle the LED status of a specific Daikin air conditioner unit.
 * It supports both immediate LED state changes and scheduling via a CRON expression.
 *
 * @param {Request} req - The HTTP request object which contains the following:
 *   - `req.body.enabled` (boolean): Determines whether to enable or disable the LEDs.
 *   - `req.body.cronExpression` (string, optional): A CRON expression for scheduling LED activation/deactivation.
 *   - `req.params.id` (string): The unique identifier of the Daikin air conditioner in the database.
 * @param {Response} res - The HTTP response object for sending the result of the operation to the client.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 *
 * @throws {500} If an error occurs while processing the operation, logs the error and responds with an internal server error status.
 *
 * @returns {Promise<Response>}
 *   - Sends a `202 Accepted` response if the operation is scheduled via a CRON expression.
 *   - Sends a `200 OK` response along with the result of the LED operation for immediate changes.
 *   - Sends a `500 Internal Server Error` response in case of failures.
 */
const enableLEDs = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
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
    return res.sendStatus(500);
}

export default { setValues, discover, getInformation, setValuesRaw, enableLEDs };
