import {Request, Response, NextFunction} from "express";
import Lumene, {LumeneDocument} from "../../../data/models/projection-screen/lumene/Lumene";
import Serial from "../../../lib/serial/Serial";

const UP_HEX_VALUE = [0xFF, 0xEE, 0xEE, 0xEE, 0xDD];
const DOWN_HEX_VALUE = [0xFF, 0xEE, 0xEE, 0xEE, 0xEE];
const STOP_HEX_VALUE = [0xFF, 0xEE, 0xEE, 0xEE, 0xCC];
const ALLOW_CONTROL_HEX_VALUE = [0xFF, 0xEE, 0xEE, 0xEE, 0xAA];

/**
 * Handles an HTTP request to move a device screen up.
 *
 * This asynchronous function retrieves a screen record from the database
 * based on the supplied request parameter `id`. If the screen is found,
 * it sends a command to the device via its configured serial port to
 * perform the "up" action. If the screen is not found, it responds with
 * a 404 HTTP status. If an error occurs during execution, it logs the error
 * and responds with a 500 HTTP status.
 *
 * @async
 * @function
 * @param {Request} req - The HTTP request object, containing the `id` parameter.
 * @param {Response} res - The HTTP response object used to send the response.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {Promise<Response>} A promise resolving to the HTTP response object
 * indicating the result of the operation.
 */
const up = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const screen = await Lumene.findById(req.params.id);

        if (screen) {
            //await Serial.write(screen.serialPortPath, 2400, ALLOW_CONTROL_HEX_VALUE);
            await Serial.write(screen.serialPortPath, 2400, UP_HEX_VALUE);

            return res.sendStatus(200);
        }
        return res.sendStatus(404);
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

/**
 * Handles the DOWN operation for a specific screen by its ID.
 *
 * This function retrieves a screen object based on the `id` parameter in the request,
 * and attempts to send a "down" command to its associated serial port using the
 * `Serial.write` method. The serial port configuration includes the specified `serialPortPath`,
 * a baud rate of 2400, and a predefined `DOWN_HEX_VALUE`.
 *
 * If the screen is found, the command is sent, and the function responds with an HTTP status
 * code 200. If the screen is not found, a 404 status code is returned. In case of an error,
 * the function logs the error to the console and returns a 500 status code with the error message.
 *
 * @param {Request} req - The HTTP request object, including `params.id` for the screen ID.
 * @param {Response} res - The HTTP response object used for sending status codes and messages.
 * @param {NextFunction} next - The next middleware function in the Express.js request-response cycle.
 * @returns {Promise<Response>} - A Promise resolving to the HTTP response object.
 */
const down = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const screen = await Lumene.findById(req.params.id);

        if (screen) {
            //await Serial.write(screen.serialPortPath, 2400, ALLOW_CONTROL_HEX_VALUE);
            await Serial.write(screen.serialPortPath, 2400, DOWN_HEX_VALUE);

            return res.sendStatus(200);
        }
        return res.sendStatus(404);
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

/**
 * Handles the stop request for a screen resource by communicating with its serial port.
 *
 * This function attempts to find a screen resource using the provided `id` parameter from the request.
 * If the screen is found, it sends specific hexadecimal control commands to the associated serial port
 * to initiate a stop operation. Returns a success HTTP status if the operation is completed successfully.
 * If the screen is not found, it returns a 404 HTTP status. In the event of an unexpected error, it
 * returns a 500 HTTP status along with the error message.
 *
 * @param {Request} req - The HTTP request object, containing parameters and other request data.
 * @param {Response} res - The HTTP response object, used to send back the result of the operation.
 * @param {NextFunction} next - The next middleware function in the Express pipeline.
 * @returns {Promise<Response>} A promise that resolves to the HTTP response indicating the result of the operation.
 */
const stop = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const screen = await Lumene.findById(req.params.id);

        if (screen) {
            await Serial.write(screen.serialPortPath, 2400, ALLOW_CONTROL_HEX_VALUE);
            await Serial.write(screen.serialPortPath, 2400, STOP_HEX_VALUE);

            return res.sendStatus(200);
        }
        return res.sendStatus(404);
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

export default { up, down, stop };
