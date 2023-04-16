import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

class CleanApiClient extends AbstractClient {
    private static instance: CleanApiClient;
    baseUrl = "/cleaning";

    private constructor() {
        super();
    }

    public static getInstance(): CleanApiClient {
        if (_.isNil(CleanApiClient.instance)) {
            CleanApiClient.instance = new CleanApiClient();
        }

        return CleanApiClient.instance;
    }

    async allRoborocks(): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/roborocks/devices`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer tous les aspirateurs Roborock.");
            throw error;
        }
    }

    async getRoborock(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/roborocks/devices/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer un aspirateur Roborock.");
            throw error;
        }
    }

    async getRoborockState(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/roborocks/devices/${id}/capabilities/state`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer l'état d'un aspirateur Roborock.");
            throw error;
        }
    }

    async updateRoborock(id: string, data: any): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().put(`${this.baseUrl}/roborocks/devices/${id}`, data);
        } catch (error: any) {
            super.handleError(error,"Impossible de mettre à jour l'aspirateur Roborock.");
            throw error;
        }
    }

    async controlRoborock(id: string, action: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/roborocks/devices/${id}/capabilities/control`, {
                "action": action
            });
        } catch (error: any) {
            super.handleError(error,"Impossible de contrôler l'aspirateur Roborock.");
            throw error;
        }
    }

    async startRoborock(id: string): Promise<AxiosResponse> {
        try {
            return await this.controlRoborock(id, "app_start");
        } catch (error: any) {
            super.handleError(error,"Impossible de démarrer l'aspirateur Roborock.");
            throw error;
        }
    }

    async pauseRoborock(id: string): Promise<AxiosResponse> {
        try {
            return await this.controlRoborock(id, "app_pause");
        } catch (error: any) {
            super.handleError(error,"Impossible de mettre en pause l'aspirateur Roborock.");
            throw error;
        }
    }

    async stopRoborock(id: string): Promise<AxiosResponse> {
        try {
            return await this.controlRoborock(id, "app_stop");
        } catch (error: any) {
            super.handleError(error,"Impossible de stopper l'aspirateur Roborock.");
            throw error;
        }
    }

    async chargeRoborock(id: string): Promise<AxiosResponse> {
        try {
            return await this.controlRoborock(id, "app_charge");
        } catch (error: any) {
            super.handleError(error,"Impossible de charger l'aspirateur Roborock.");
            throw error;
        }
    }
}

export default CleanApiClient;
