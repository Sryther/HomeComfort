import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

class VideoProjectorApiClient extends AbstractClient {
    private static instance: VideoProjectorApiClient;
    baseUrl = "/video-projector";

    private constructor() {
        super();
    }

    public static getInstance(): VideoProjectorApiClient {
        if (_.isNil(VideoProjectorApiClient.instance)) {
            VideoProjectorApiClient.instance = new VideoProjectorApiClient();
        }

        return VideoProjectorApiClient.instance;
    }

    async allViewsonics(): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/viewsonic`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer tous les projecteurs Viewsonic.");
            throw error;
        }
    }

    async getViewsonic(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/viewsonic/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer le projecteur Viewsonic.");
            throw error;
        }
    }

    async getViewsonicState(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/viewsonic/${id}/state`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer l'état du projecteur Viewsonic.");
            throw error;
        }
    }

    async updateViewsonic(id: string, data: any): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().put(`${this.baseUrl}/viewsonic/${id}`, data);
        } catch (error: any) {
            super.handleError(error,"Impossible de mettre à jour le projecteur Viewsonic.");
            throw error;
        }
    }

    async powerOnViewsonic(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/viewsonic/${id}/power-on`);
        } catch (error: any) {
            super.handleError(error,"Impossible d'allumer le projecteur Viewsonic.");
            throw error;
        }
    }

    async powerOffViewsonic(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/viewsonic/${id}/power-off`);
        } catch (error: any) {
            super.handleError(error,"Impossible d'allumer le projecteur Viewsonic.");
            throw error;
        }
    }
}

export default VideoProjectorApiClient;
