import {Request, Response, NextFunction} from "express";
import ViewSonic  from "../../../data/models/video-projector/viewsonic/ViewSonic";
import Serial from "../../../lib/serial/Serial";

const ON_HEX_VALUE = [0x06, 0x14, 0x00, 0x04, 0x00, 0x34, 0x11, 0x00, 0x00, 0x5D];
const OFF_HEX_VALUE = [0x06, 0x14, 0x00, 0x04, 0x00, 0x34, 0x11, 0x01, 0x00, 0x5E];
const STATE_HEX_VALUE = [0x07, 0x14, 0x00, 0x05, 0x00, 0x34, 0x00, 0x00, 0x11, 0x00, 0x5E];

/**
 * Handles an HTTP request to turn on a projector.
 *
 * This asynchronous function retrieves a projector by its ID from the database,
 * and if found, sends a command to power it on via serial communication.
 * Responds with an appropriate HTTP status based on the outcome.
 *
 * @param {Request} req - The HTTP request object, containing parameters that include the projector ID.
 * @param {Response} res - The HTTP response object used to send the response back to the client.
 * @param {NextFunction} next - Callback to pass control to the next middleware in the stack.
 * @returns {Promise<Response>} A promise resolving to the HTTP response.
 *
 * Possible outcomes:
 * - 200: Projector found and powered on successfully.
 * - 404: Projector not found in the database.
 * - 500: Internal server error.
 */
const on = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const projector = await ViewSonic.findById(req.params.id);

        if (projector) {
            await Serial.write(projector.serialPortPath, 115200, ON_HEX_VALUE);

            return res.sendStatus(200);
        }
        return res.status(404).send("Projector not found");
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

/**
 * Handles turning off a projector device by sending the appropriate command through its serial port.
 *
 * @param {Request} req - The HTTP request object, expected to contain a parameter `id` representing the projector ID.
 * @param {Response} res - The HTTP response object, used to send the response status.
 * @param {NextFunction} next - The next middleware function in the Express pipeline.
 * @returns {Promise<Response>} A Promise resolving to an HTTP response with the appropriate status:
 *                              - 200 if the projector was successfully turned off.
 *                              - 404 if the projector was not found.
 *                              - 500 if an error occurred during the process.
 *
 * @throws {Error} Logs and returns a 500 status response if an unhandled exception occurs during execution.
 */
const off = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const projector = await ViewSonic.findById(req.params.id);

        if (projector) {
            await Serial.write(projector.serialPortPath, 115200, OFF_HEX_VALUE);
            return res.sendStatus(200);
        }
        return res.sendStatus(404);
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

/**
 * Handles the retrieval of the state of a projector by communicating via its serial port.
 *
 * This function retrieves a projector's details based on its ID from the database,
 * reads its state through a serial port, and responds with the corresponding state.
 * If the projector is not found, it responds with a 404 status. If an error occurs,
 * it responds with a 500 status code along with the error message.
 *
 * @param {Request} req The HTTP request object, containing the projector ID in `req.params.id`.
 * @param {Response} res The HTTP response object, used to send back the state or error responses.
 * @param {NextFunction} next The middleware function, unused in this context.
 * @returns {Promise<Response>} A promise resolving to the HTTP response, containing the projector state
 *                              ("ON", "OFF", "UNKNOWN") or an error status/code.
 */
const state = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const projector = await ViewSonic.findById(req.params.id);

        if (projector) {
            const data = await Serial.read(projector.serialPortPath, 115200, STATE_HEX_VALUE);
            let output = "UNKNOWN";
            if (data === "051400030000000017") {
                output = "OFF";
            } else if (data === "051400030000000118") {
                output = "ON";
            }
            return res.status(200).send(output);
        }
        return res.sendStatus(404);
    } catch (error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
};

export default { on, off, state };
