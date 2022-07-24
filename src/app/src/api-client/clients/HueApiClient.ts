import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

class HueApiClient extends AbstractClient {
    private static instance: HueApiClient;
    baseUrl = "/light/hue";

    private constructor() {
        super();
    }

    public static getInstance(): HueApiClient {
        if (_.isNil(HueApiClient.instance)) {
            HueApiClient.instance = new HueApiClient();
        }

        return HueApiClient.instance;
    }

    async allBridges(): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/bridge`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer toutes les Bridges Hue.");
            throw error;
        }
    }

    async getBridge(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/bridge/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer le Bridge Hue.");
            throw error;
        }
    }

    async allLights(idBridge: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/bridge/${idBridge}/light`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer toutes les lumières du Bridge Hue.");
            throw error;
        }
    }

    async getLight(idBridge: string, id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/bridge/${idBridge}/light/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer la lumière du Bridge Hue.");
            throw error;
        }
    }

    async getLightState(idBridge: string, id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/bridge/${idBridge}/light/${id}/state`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer la lumière du Bridge Hue.");
            throw error;
        }
    }

    async setStateLight(idBridge: string, id: string, state: any): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/bridge/${idBridge}/light/${id}/state`, state);
        } catch (error: any) {
            super.handleError(error,"Impossible de mettre à jour l'état de la lumière du Bridge Hue.");
            throw error;
        }
    }
}

export default HueApiClient;
