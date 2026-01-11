import {discovery, api, model} from 'node-hue-api';
import Bridge from "../../../../data/models/light/hue/Bridge";
import _ from "lodash";
import {NextFunction, Request, Response} from "express";
import Light from "../../../../data/models/light/hue/Light";
import ObjectIdVerifier from "../../../../lib/api/ObjectIdVerifier";

const appName = 'node-hue-api';
const deviceName = 'helix';

type LightsType = model.Light | model.Luminaire | model.Lightsource;

/**
 * Searches for bridges in the network using the nupnp discovery method.
 * Utilizes the discovery.nupnpSearch() function to find and return a list of bridge details.
 *
 * @return {Promise<Array<Object>>} A promise that resolves to an array of bridge objects. Each object contains details about a found bridge.
 */
async function searchBridges(): Promise<Array<any>> {
    return await discovery.nupnpSearch();
}

/**
 * Discovers and configures bridges on the local network, including associated lights. Handles creating new bridges, updating existing ones, and linking users to bridge configurations.
 *
 * @param {Request} req - The HTTP request object provided by the express middleware.
 * @param {Response} res - The HTTP response object for sending responses back to the client.
 * @param {NextFunction} next - The next middleware function in the express request lifecycle.
 * @return {Promise<Response>} No return value. Sends the appropriate HTTP response based on the discovery process, including discovered bridges and errors.
 */
async function discoverBridge(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const bridgesFound = await searchBridges();
    if (bridgesFound.length === 0) {
        console.log("No bridge discovered.");
        return res.sendStatus(404);
    }

    const discoveredBridges = [];
    const errors = [];

    for (const currentBridge of bridgesFound) {
        const bridges = await Bridge.find({ip: currentBridge.ipaddress});
        let createBridge = true
        if (bridges.length > 0 && !_.isNil(bridges[0].user)) {
            console.log("Bridge exists, skipping creation");
            createBridge = false;
        }

        let bridge;
        if (!createBridge) {
            bridge = bridges[0];
        } else {
            bridge = await Bridge.create({
                ip: currentBridge.ipaddress
            });
        }

        if (createBridge) {
            const unauthenticatedApi = await api.createLocal(currentBridge.ipaddress).connect();

            let createdUser;
            try {
                createdUser = await unauthenticatedApi.users.createUser(appName, deviceName);

                bridge.user = createdUser.username;
                bridge.clientKey = createdUser.clientkey;
                await bridge.save();
            } catch (err: any) {
                errors.push(err);
            }
        }
        try {
            const authenticatedApi = await api.createLocal(currentBridge.ipaddress).connect(bridge.user);
            const bridgeConfig = await authenticatedApi.configuration.getConfiguration();
            bridge.name = bridgeConfig.name;
            await bridge.save();

            const lights: LightsType[] = await authenticatedApi.lights.getAll();
            const foundLights = [];
            for (const light of lights) {
                const lightsKnown = await Light.find({idHue: light.id});
                if (lightsKnown.length === 0) {
                    const createdLight = await Light.create({
                        idHue: light.id,
                        name: light.name,
                        state: light.state,
                        bridge: bridge._id,
                        productname: light.getAttributeValue('productname')
                    });
                    foundLights.push(createdLight);
                } else {
                    foundLights.push(lightsKnown[0]);
                }
            }

            discoveredBridges.push({bridge, foundLights});
        } catch (err: any) {
            errors.push(err);
        }
    }

    if (errors.length > 0) {
        const messages = [];
        if (discoveredBridges.length > 0) {
            messages.push(`${discoveredBridges.length} bridge(s) was discovered but errors was thrown.`);
        }

        for (const err of errors) {
            if (err.getHueErrorType() === 101) {
                messages.push("Press the Link button on the bridge and try again.");
            } else {
                messages.push(err.message);
            }
        }
        return res.status(409).send(messages);
    }

    if (discoveredBridges.length > 0) {
        return res.status(201).send(discoveredBridges);
    } else {
        return res.sendStatus(204);
    }
}

/**
 * Retrieves the configuration of a bridge based on the provided bridge ID in the request.
 * If the bridge is found, attempts to establish a connection and fetch the current configuration.
 * Responds with the configuration data or appropriate status codes based on the outcome.
 *
 * @param {Request} req - The HTTP request object containing the bridge ID in the path parameters.
 * @param {Response} res - The HTTP response object used to send the configuration or status code back to the client.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @return {Promise<Response>} A Promise that resolves when the process completes, sending the bridge configuration, a 404 status code if not found, or a 500 status code on error.
 */
async function getBridgeConfiguration(req: Request, res: Response, next: NextFunction): Promise<Response> {
    if (!_.isNil(ObjectIdVerifier(["id"], req, res, next))) {
        return res.sendStatus(400);
    }

    const bridge = await Bridge.findById(req.params.id);

    if (bridge) {
        try {
            const authenticatedApi = await api.createLocal(bridge.ip).connect(bridge.user);
            const bridgeConfig = await authenticatedApi.configuration.getConfiguration();

            return res.send(bridgeConfig);
        } catch(error: any) {
            console.error(`Couldn't get configuration of bridge ${bridge.name}`, error);
            return res.status(500).send(error.message);
        }
    }

    return res.sendStatus(404);
}

/**
 * Retrieves a list of lights associated with a specific bridge.
 *
 * @param {Request} req - The HTTP request object, containing the bridge ID in the parameters.
 * @param {Response} res - The HTTP response object used to send the response.
 * @param {NextFunction} next - The next middleware function in the request-response cycle.
 * @return {Promise<Response>} Resolves with a response containing the list of lights if the bridge exists,
 *                         or a 404 status code if the bridge is not found.
 */
async function getLights(req: Request, res: Response, next: NextFunction): Promise<Response> {
    if (!_.isNil(ObjectIdVerifier(["idBridge"], req, res, next))) {
        return res.sendStatus(400);
    }

    const bridge = await Bridge.findById(req.params.idBridge);
    const lights = await Light.find({ bridge: req.params.idBridge });

    if (bridge) {
        return res.send(lights);
    }

    return res.sendStatus(404);
}

/**
 * Retrieves a light resource by its ID and associated bridge ID.
 *
 * @param {Request} req - The HTTP request object, containing route parameters `id` and `idBridge` for the light and bridge respectively.
 * @param {Response} res - The HTTP response object used to send the retrieved light data or a status code.
 * @param {NextFunction} next - The function to pass control to the next middleware in the stack.
 * @return {Promise<Response>} Resolves with the light object if found, or sends a 404 status code if not found.
 */
async function getLight(req: Request, res: Response, next: NextFunction): Promise<Response> {
    if (!_.isNil(ObjectIdVerifier(["id", "idBridge"], req, res, next))) {
        return res.sendStatus(400);
    }

    const bridge = await Bridge.findById(req.params.idBridge);
    const light = await Light.findById(req.params.id);

    if (bridge && light) {
        return res.send(light);
    }

    return res.sendStatus(404);
}

/**
 * Retrieves the state of a specific light by interacting with the associated bridge.
 *
 * @param {Request} req - The HTTP request object containing parameters such as `id` and `idBridge`.
 * @param {Response} res - The HTTP response object used to send back the light state or error information.
 * @param {NextFunction} next - The NextFunction callback for passing control to the next middleware.
 * @return {Promise<Response>} A promise that resolves with the light state if successful, or an HTTP error status otherwise.
 */
async function getLightState(req: Request, res: Response, next: NextFunction): Promise<Response> {
    if (!_.isNil(ObjectIdVerifier(["id", "idBridge"], req, res, next))) {
        return res.sendStatus(400);
    }

    const bridge = await Bridge.findById(req.params.idBridge);
    const light = await Light.findById(req.params.id);

    if (bridge && light) {
        try {
            const authenticatedApi = await api.createLocal(bridge.ip).connect(bridge.user);
            const lightInformation = await authenticatedApi.lights.getLightState(light.idHue);

            return res.send(lightInformation);
        } catch (error: any) {
            console.error(`Couldn't get state of light ${light.name} (${light.idHue}) of bridge ${bridge.name}`, error);
            return res.status(500).send(error.message);
        }
    }

    return res.sendStatus(404);
}

/**
 * Updates the state of a light associated with a specific bridge using the provided parameters.
 *
 * @param {Request} req - The HTTP request object containing parameters and body data.
 *                         Expected parameters: `id` (light ID), `idBridge` (bridge ID).
 *                         Expected body properties:
 *                         - `power` (string): "on" or "off" to control light power state.
 *                         - `brightness` (number): Integer value for light brightness.
 *                         - `color` (object): Object containing `hue`, `saturation`, and `brightness` properties for light color configuration.
 * @param {Response} res - The HTTP response object for sending the response.
 * @param {NextFunction} next - The next middleware function in the execution chain.
 * @return {Promise<Response>} Resolves with an HTTP response indicating:
 *                             - 200 if the light state is successfully updated.
 *                             - 400 if request validation fails.
 *                             - 404 if light or bridge is not found.
 *                             - 500 if an error occurs during state update.
 */
async function setLightState(req: Request, res: Response, next: NextFunction): Promise<Response> {
    if (!_.isNil(ObjectIdVerifier(["id", "idBridge"], req, res, next))) {
        return res.sendStatus(400);
    }

    const bridge = await Bridge.findById(req.params.idBridge);
    const light = await Light.findById(req.params.id);

    if (bridge && light) {
        const authenticatedApi = await api.createLocal(bridge.ip).connect(bridge.user);

        const state = new model.LightState();
        const power: string = req.body.power;
        const brightness: number = req.body.brightness;
        const color: { hue: number, saturation: number, brightness: number } = req.body.color;

        if (!_.isNil(power)) {
            if (power === "on") {
                state.on();
            } else if (power === "off") {
                state.off();
            }
        }

        if (!_.isNil(color)) {
            state.hsl(color.hue, color.saturation, color.brightness);
        }

        if (!_.isNil(brightness)) {
            state.brightness(brightness);
        }

        try {
            await authenticatedApi.lights.setLightState(light.idHue, state);
            return res.send(200);
        } catch (error: any) {
            console.error(`Couldn't set state of light ${light.name} (${light.idHue}) of bridge ${bridge.name}`, error);
            return res.status(500).send(error.message);
        }
    }

    return res.sendStatus(404);
}

export {discoverBridge, getBridgeConfiguration, getLights, getLight, getLightState, setLightState};
