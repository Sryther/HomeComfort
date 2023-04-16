import {discovery, api, model} from 'node-hue-api';
import Bridge from "../../../../data/models/light/hue/Bridge";
import _ from "lodash";
import {NextFunction, Request, Response} from "express";
import Light from "../../../../data/models/light/hue/Light";
import ObjectIdVerifier from "../../../../lib/api/ObjectIdVerifier";

const appName = 'node-hue-api';
const deviceName = 'helix';

type LightsType = model.Light | model.Luminaire | model.Lightsource;

async function searchBridges() {
    return await discovery.nupnpSearch();
}

async function discoverBridge(req: Request, res: Response, next: NextFunction) {
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

async function getBridgeConfiguration(req: Request, res: Response, next: NextFunction) {
    if (!_.isNil(ObjectIdVerifier(["id"], req, res, next))) return;

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

async function getLights(req: Request, res: Response, next: NextFunction) {
    if (!_.isNil(ObjectIdVerifier(["idBridge"], req, res, next))) return;

    const bridge = await Bridge.findById(req.params.idBridge);
    const lights = await Light.find({ bridge: req.params.idBridge });

    if (bridge) {
        return res.send(lights);
    }

    return res.sendStatus(404);
}

async function getLight(req: Request, res: Response, next: NextFunction) {
    if (!_.isNil(ObjectIdVerifier(["id", "idBridge"], req, res, next))) return;

    const bridge = await Bridge.findById(req.params.idBridge);
    const light = await Light.findById(req.params.id);

    if (bridge && light) {
        return res.send(light);
    }

    return res.sendStatus(404);
}

async function getLightState(req: Request, res: Response, next: NextFunction) {
    if (!_.isNil(ObjectIdVerifier(["id", "idBridge"], req, res, next))) return;

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

async function setLightState(req: Request, res: Response, next: NextFunction) {
    if (!_.isNil(ObjectIdVerifier(["id", "idBridge"], req, res, next))) return;

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
