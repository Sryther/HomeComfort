import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

class AirApiClient extends AbstractClient {
    private static instance: AirApiClient;
    baseUrl = "/air";

    private constructor() {
        super();
    }

    public static getInstance(): AirApiClient {
        if (_.isNil(AirApiClient.instance)) {
            AirApiClient.instance = new AirApiClient();
        }

        return AirApiClient.instance;
    }

    async allDaikins(): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/daikin`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer toutes les unités Daikin.");
            throw error;
        }
    }

    async getDaikin(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/daikin/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer une unité Daikin.");
            throw error;
        }
    }

    async getDaikinInformation(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/daikin/${id}/information`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer une unité Daikin.");
            throw error;
        }
    }

    async updateDaikin(id: string, data: any): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().put(`${this.baseUrl}/daikin/${id}`, data);
        } catch (error: any) {
            super.handleError(error,"Impossible de mettre à jour l'unité Daikin.");
            throw error;
        }
    }

    async setDaikinValues(id: string, data: any): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/daikin/${id}/set-values`, data);
        } catch (error: any) {
            super.handleError(error, "Impossible de mettre à jour les paramètres de l'unité Daikin.");
            throw error;
        }
    }

    async setDaikinLeds(id: string, enabled: boolean): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/daikin/${id}/leds`, { enabled: enabled });
        } catch (error: any) {
            super.handleError(error, "Impossible de mettre à jour les paramètres de l'unité Daikin.");
            throw error;
        }
    }
}

export default AirApiClient;
