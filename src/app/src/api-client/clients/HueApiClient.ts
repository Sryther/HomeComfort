import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

/**
 * The HueApiClient class provides methods to interact with the Hue lighting system.
 * It acts as a client for retrieving and managing Hue bridges and lights.
 * Implements the singleton pattern to ensure only one instance of the client exists.
 *
 * Extends the AbstractClient class for shared client functionality.
 */
class HueApiClient extends AbstractClient {
    private static instance: HueApiClient;
    baseUrl = "/light/hue";

    private constructor() {
        super();
    }

    /**
     * Retrieves the singleton instance of the HueApiClient.
     * If no instance exists, a new one is created and returned.
     *
     * @return {HueApiClient} The singleton instance of HueApiClient.
     */
    public static getInstance(): HueApiClient {
        if (_.isNil(HueApiClient.instance)) {
            HueApiClient.instance = new HueApiClient();
        }

        return HueApiClient.instance;
    }

    /**
     * Retrieves a list of all bridges from the Hue system.
     *
     * Makes an asynchronous API call to fetch data about all available bridges.
     * Handles errors during the request process and logs them appropriately.
     *
     * @return {Promise<AxiosResponse>} A promise that resolves to the API response containing bridge data.
     * @throws Will throw an error if the API request fails.
     */
    async allBridges(): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/bridge`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer toutes les Bridges Hue.");
            throw error;
        }
    }

    /**
     * Fetches a Bridge resource by its unique identifier.
     *
     * @param {string} id - The unique identifier of the Bridge resource to retrieve.
     * @return {Promise<AxiosResponse>} A promise resolving with the HTTP response containing the Bridge data.
     * @throws Will throw an error if the retrieval fails.
     */
    async getBridge(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/bridge/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer le Bridge Hue.");
            throw error;
        }
    }

    /**
     * Retrieves all lights associated with a specific Hue Bridge.
     *
     * @param {string} idBridge - The unique identifier of the Hue Bridge.
     * @return {Promise<AxiosResponse>} A promise that resolves with the response containing the lights information.
     */
    async allLights(idBridge: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/bridge/${idBridge}/light`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer toutes les lumières du Bridge Hue.");
            throw error;
        }
    }

    /**
     * Fetches the light resource from the specified bridge.
     *
     * @param {string} idBridge - The unique identifier of the bridge to retrieve the light from.
     * @param {string} id - The unique identifier of the light to be retrieved.
     * @return {Promise<AxiosResponse>} A promise that resolves to the Axios response containing the light data.
     */
    async getLight(idBridge: string, id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/bridge/${idBridge}/light/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer la lumière du Bridge Hue.");
            throw error;
        }
    }

    /**
     * Retrieves the state of a specific light connected to the Hue Bridge.
     *
     * @param {string} idBridge - The unique identifier of the Hue Bridge.
     * @param {string} id - The unique identifier of the light.
     * @return {Promise<AxiosResponse>} A promise that resolves with the response containing the light state.
     * @throws Will rethrow any error encountered during the request if the light state cannot be retrieved.
     */
    async getLightState(idBridge: string, id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/bridge/${idBridge}/light/${id}/state`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer la lumière du Bridge Hue.");
            throw error;
        }
    }

    /**
     * Updates the state of a specific light in the Hue Bridge.
     *
     * @param {string} idBridge - The unique identifier of the Hue Bridge.
     * @param {string} id - The unique identifier of the light within the Hue Bridge.
     * @param {any} state - The desired state to update the light with.
     * @return {Promise<AxiosResponse>} A promise that resolves to the Axios response after updating the light's state.
     * @throws Will throw an error if the update operation fails.
     */
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
