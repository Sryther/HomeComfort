import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

class SceneApiClient extends AbstractClient {
    private static instance: SceneApiClient;
    baseUrl = "/scene";

    private constructor() {
        super();
    }

    public static getInstance(): SceneApiClient {
        if (_.isNil(SceneApiClient.instance)) {
            SceneApiClient.instance = new SceneApiClient();
        }

        return SceneApiClient.instance;
    }

    async all(): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer toutes les scènes.");
            throw error;
        }
    }

    async get(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer la scène.");
            throw error;
        }
    }

    async update(id: string, data: any): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().put(`${this.baseUrl}/${id}`, data);
        } catch (error: any) {
            super.handleError(error,"Impossible de mettre à jour la scène.");
            throw error;
        }
    }

    async run(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de lancer la scène.");
            throw error;
        }
    }
}

export default SceneApiClient;
