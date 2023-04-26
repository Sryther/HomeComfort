import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

class ProjectionScreenApiClient extends AbstractClient {
    private static instance: ProjectionScreenApiClient;
    baseUrl = "/projection-screen";

    private constructor() {
        super();
    }

    public static getInstance(): ProjectionScreenApiClient {
        if (_.isNil(ProjectionScreenApiClient.instance)) {
            ProjectionScreenApiClient.instance = new ProjectionScreenApiClient();
        }

        return ProjectionScreenApiClient.instance;
    }

    async allLumenes(): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/lumene`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer tous les terminaux.");
            throw error;
        }
    }

    async getLumene(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/endpoints/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer le terminal.");
            throw error;
        }
    }

    async upLumene(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/lumene/${id}/up`);
        } catch (error: any) {
            super.handleError(error,"Impossible de remonter la toile Lumene.");
            throw error;
        }
    }

    async downLumene(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/lumene/${id}/down`);
        } catch (error: any) {
            super.handleError(error,"Impossible de descendre la toile Lumene.");
            throw error;
        }
    }

    async updateLumene(id: string, data: any): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().put(`${this.baseUrl}/lumene/${id}`, data);
        } catch (error: any) {
            super.handleError(error,"Impossible de mettre à jour la toile Lumene.");
            throw error;
        }
    }
}

export default ProjectionScreenApiClient;
