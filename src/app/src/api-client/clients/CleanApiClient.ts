import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

/**
 * A client for managing and controlling Roborock vacuum devices via the cleaning API.
 * This class implements functionality for retrieving, updating, and sending control commands to Roborocks.
 * It adheres to the Singleton pattern, ensuring that only one instance of the class is created and used throughout the application.
 *
 * Extends:
 * - AbstractClient
 */
class CleanApiClient extends AbstractClient {
    private static instance: CleanApiClient;
    baseUrl = "/cleaning";

    private constructor() {
        super();
    }

    /**
     * Retrieves the single instance of the CleanApiClient class, ensuring it follows the Singleton pattern.
     *
     * @return {CleanApiClient} The single instance of the CleanApiClient class.
     */
    public static getInstance(): CleanApiClient {
        if (_.isNil(CleanApiClient.instance)) {
            CleanApiClient.instance = new CleanApiClient();
        }

        return CleanApiClient.instance;
    }

    /**
     * Retrieves a list of all Roborock devices from the API.
     *
     * @return {Promise<AxiosResponse>} A promise that resolves to the response containing the list of Roborock devices.
     * @throws Will throw an error if the API request fails.
     */
    async allRoborocks(): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/roborocks/devices`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer tous les aspirateurs Roborock.");
            throw error;
        }
    }

    /**
     * Retrieves information about a specific Roborock device by its unique identifier.
     *
     * @param {string} id - The unique identifier of the Roborock device to retrieve.
     * @return {Promise<AxiosResponse>} A promise that resolves to the Axios response containing the device details.
     * @throws Will throw an error if the Roborock device retrieval fails.
     */
    async getRoborock(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/roborocks/devices/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer un aspirateur Roborock.");
            throw error;
        }
    }

    /**
     * Retrieves the state of a Roborock device by its ID.
     *
     * @param {string} id - The unique identifier of the Roborock device.
     * @return {Promise<AxiosResponse>} A promise that resolves to the AxiosResponse containing the state of the Roborock device.
     */
    async getRoborockState(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/roborocks/devices/${id}/capabilities/state`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer l'état d'un aspirateur Roborock.");
            throw error;
        }
    }

    /**
     * Updates the configuration or details of a Roborock device.
     *
     * @param {string} id - The unique identifier of the Roborock device to be updated.
     * @param {any} data - The data payload containing the updated details for the device.
     * @return {Promise<AxiosResponse>} A promise resolving to the Axios response containing the result of the update operation.
     */
    async updateRoborock(id: string, data: any): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().put(`${this.baseUrl}/roborocks/devices/${id}`, data);
        } catch (error: any) {
            super.handleError(error,"Impossible de mettre à jour l'aspirateur Roborock.");
            throw error;
        }
    }

    /**
     * Sends a control command to a specified Roborock device.
     *
     * @param {string} id - The unique identifier of the Roborock device to control.
     * @param {string} action - The action to be performed on the device (e.g., start, stop, dock).
     * @return {Promise<AxiosResponse>} A promise that resolves to the response of the API call.
     * @throws Will throw an error if the control command fails.
     */
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

    /**
     * Starts the Roborock vacuum cleaner by sending a start command.
     *
     * @param {string} id - The unique identifier of the Roborock device to start.
     * @return {Promise<AxiosResponse>} A promise that resolves to the AxiosResponse object containing the result of the start command.
     */
    async startRoborock(id: string): Promise<AxiosResponse> {
        try {
            return await this.controlRoborock(id, "app_start");
        } catch (error: any) {
            super.handleError(error,"Impossible de démarrer l'aspirateur Roborock.");
            throw error;
        }
    }

    /**
     * Pauses the Roborock vacuum cleaner associated with the given identifier.
     *
     * @param {string} id - The unique identifier of the Roborock vacuum cleaner to pause.
     * @return {Promise<AxiosResponse>} A promise that resolves to the Axios response of the pause request.
     * @throws Will throw an error if the pause operation fails.
     */
    async pauseRoborock(id: string): Promise<AxiosResponse> {
        try {
            return await this.controlRoborock(id, "app_pause");
        } catch (error: any) {
            super.handleError(error,"Impossible de mettre en pause l'aspirateur Roborock.");
            throw error;
        }
    }

    /**
     * Stops the Roborock vacuum cleaner with the specified ID.
     *
     * @param {string} id - The unique identifier of the Roborock device to be stopped.
     * @return {Promise<AxiosResponse>} A promise resolving to the response from the Roborock API.
     * @throws Will throw an error if the Roborock device cannot be stopped.
     */
    async stopRoborock(id: string): Promise<AxiosResponse> {
        try {
            return await this.controlRoborock(id, "app_stop");
        } catch (error: any) {
            super.handleError(error,"Impossible de stopper l'aspirateur Roborock.");
            throw error;
        }
    }

    /**
     * Sends a command to charge the specified Roborock vacuum cleaner.
     *
     * @param {string} id - The unique identifier of the Roborock vacuum cleaner.
     * @return {Promise<AxiosResponse>} A promise that resolves to the response of the charging command.
     * @throws Will throw an error if the command fails to execute.
     */
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
