import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

class NetworkApiClient extends AbstractClient {
    private static instance: NetworkApiClient;
    baseUrl = "/network";

    private constructor() {
        super();
    }

    public static getInstance(): NetworkApiClient {
        if (_.isNil(NetworkApiClient.instance)) {
            NetworkApiClient.instance = new NetworkApiClient();
        }

        return NetworkApiClient.instance;
    }

    async allEndpoints(): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/endpoints`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer tous les terminaux.");
            throw error;
        }
    }

    async getEndpoint(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/endpoints/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer le terminal.");
            throw error;
        }
    }

    async wakeEndpoint(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/endpoints/${id}/wake`);
        } catch (error: any) {
            super.handleError(error,"Impossible de réveiller le terminal.");
            throw error;
        }
    }

    async isEndpointAlive(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/endpoints/${id}/alive`);
        } catch (error: any) {
            super.handleError(error,"Impossible de vérifier l'état du terminal.");
            throw error;
        }
    }

    async updateEndpoint(id: string, data: any): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().put(`${this.baseUrl}/endpoints/${id}`, data);
        } catch (error: any) {
            super.handleError(error,"Impossible de mettre à jour le terminal.");
            throw error;
        }
    }
}

export default NetworkApiClient;
