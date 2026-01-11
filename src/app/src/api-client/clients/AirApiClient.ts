import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

/**
 * AirApiClient is a singleton class responsible for handling API interactions related to Daikin air units.
 * It provides methods to perform CRUD operations and manage settings for the Daikin units.
 * This class extends AbstractClient and uses ApiClient for HTTP requests.
 */
class AirApiClient extends AbstractClient {
    private static instance: AirApiClient;
    baseUrl = "/air";

    private constructor() {
        super();
    }

    /**
     * Retrieves the singleton instance of the AirApiClient class. If an instance does not already exist,
     * it creates one and returns it. This ensures that only one instance of the AirApiClient class
     * exists throughout the application's lifecycle.
     *
     * @return {AirApiClient} The singleton instance of the AirApiClient class.
     */
    public static getInstance(): AirApiClient {
        if (_.isNil(AirApiClient.instance)) {
            AirApiClient.instance = new AirApiClient();
        }

        return AirApiClient.instance;
    }

    /**
     * Retrieves all Daikin units by making an API request to the server.
     *
     * @return {Promise<AxiosResponse>} A promise that resolves to the Axios response containing the Daikin units data.
     * @throws Will throw an error if the API request fails.
     */
    async allDaikins(): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/daikin`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer toutes les unités Daikin.");
            throw error;
        }
    }

    /**
     * Retrieves Daikin unit information by its ID.
     *
     * @param {string} id - The unique identifier of the Daikin unit to retrieve.
     * @return {Promise<AxiosResponse>} A promise that resolves to the Axios response containing the Daikin unit data.
     * @throws {Error} If the request fails or an error occurs while fetching the Daikin unit information.
     */
    async getDaikin(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/daikin/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer une unité Daikin.");
            throw error;
        }
    }

    /**
     * Retrieves information about a Daikin unit by its identifier.
     *
     * @param {string} id - The unique identifier of the Daikin unit.
     * @return {Promise<AxiosResponse>} A promise resolving to the response containing the Daikin unit information.
     */
    async getDaikinInformation(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/daikin/${id}/information`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer une unité Daikin.");
            throw error;
        }
    }

    /**
     * Updates the Daikin unit with the specified ID using the provided data.
     *
     * @param {string} id - The unique identifier of the Daikin unit to be updated.
     * @param {any} data - The data object containing the updated information for the Daikin unit.
     * @return {Promise<AxiosResponse>} A promise that resolves to the response from the API after updating the Daikin unit.
     */
    async updateDaikin(id: string, data: any): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().put(`${this.baseUrl}/daikin/${id}`, data);
        } catch (error: any) {
            super.handleError(error,"Impossible de mettre à jour l'unité Daikin.");
            throw error;
        }
    }

    /**
     * Sets the values for a Daikin unit by sending a POST request to the Daikin API.
     *
     * @param {string} id - The unique identifier of the Daikin unit to update.
     * @param {any} data - The data payload containing the values to be set for the Daikin unit.
     * @return {Promise<AxiosResponse>} A promise resolving to the response from the Daikin API.
     * @throws Will throw an error if the API request fails or an issue occurs during the process.
     */
    async setDaikinValues(id: string, data: any): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/daikin/${id}/set-values`, data);
        } catch (error: any) {
            super.handleError(error, "Impossible de mettre à jour les paramètres de l'unité Daikin.");
            throw error;
        }
    }

    /**
     * Updates the LED settings for a specified Daikin unit.
     *
     * @param {string} id - The unique identifier of the Daikin unit.
     * @param {boolean} enabled - A boolean value indicating whether the LEDs should be enabled or disabled.
     * @return {Promise<AxiosResponse>} A promise resolving with the Axios response of the API call.
     */
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
