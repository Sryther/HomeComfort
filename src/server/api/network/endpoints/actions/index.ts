import wol from 'wol';
import ping from 'ping';
import {Request, Response, NextFunction} from "express";

import Endpoint from "../../../../data/models/network/Endpoint";

/**
 * Sends a Wake-on-LAN (WoL) magic packet to a specified endpoint.
 *
 * This function retrieves an endpoint's details from the database based on the
 * `id` parameter in the incoming request. If the endpoint exists, it constructs
 * the appropriate broadcast address and port, depending on the endpoint's
 * configuration. A magic packet is then sent to the endpoint using its MAC address.
 *
 * If the operation is successful, the corresponding HTTP response is sent. Errors
 * occurring during the process or an invalid endpoint ID result in appropriate HTTP
 * error responses.
 *
 * @param {Request} req - The HTTP request object, containing the endpoint's ID as a parameter.
 * @param {Response} res - The HTTP response object, used to send back the result or error.
 * @param {NextFunction} next - The next middleware function in the Express.js request-response cycle.
 * @returns {Promise<Response>} A promise that resolves to the HTTP response object.
 */
const wake = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const endpoint = await Endpoint.findById(req.params.id);

        if (endpoint) {
            let address: String = "255.255.255.255"; // Broadcast address on a local network.
            if (endpoint.gateway6) {
                address = endpoint.gateway6;
            }
            if (endpoint.gateway4) {
                address = endpoint.gateway4;
            }

            let port = 7;
            if (endpoint.port) {
                port = endpoint.port
            }

            console.log(`Waking up endpoint with a magic packet using address ${address}, port ${port}.`);

            try {
                const result = await wol.wake(endpoint.mac, {address, port});
                return res.status(200).send(result);
            } catch (error: any) {
                console.error(error);
                return res.status(500).send(error.message);
            }
        }
        return res.sendStatus(404);
    } catch (error: any) {
        return res.status(500).send(error.message);
    }
};

/**
 * Middleware to check if a given endpoint is alive by performing a ping operation.
 *
 * This function retrieves an endpoint by its ID, determines its IP address
 * (prioritizing IPv6 if available, otherwise falling back to IPv4), and checks
 * the reachability of the endpoint using a ping operation.
 *
 * @param {Request} req - The HTTP request object, containing the `id` parameter which identifies the endpoint.
 * @param {Response} res - The HTTP response object used to send the result of the operation.
 * @param {NextFunction} next - A callback to pass control to the next middleware.
 * @returns {Promise<Response>} A response containing the result of the ping operation (`true` if alive, `false` otherwise),
 *                              or a status of 404 if the endpoint is not found, and 500 in case of server errors.
 *
 * @throws Will log the error to the console and return a 500 status if any server-side error occurs.
 */
const isAlive = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const endpoint = await Endpoint.findById(req.params.id);

        if (endpoint) {
            let address = "";
            if (endpoint.ip6) {
                address = endpoint.ip6;
            }
            if (endpoint.ip4) {
                address = endpoint.ip4;
            }

            const result = await ping.promise.probe(address);
            return res.status(200).send(result.alive);
        }
        return res.sendStatus(404);
    }
    catch(error: any) {
        console.error(error);
        return res.status(500).send(error.message);
    }
}

export { wake, isAlive };
