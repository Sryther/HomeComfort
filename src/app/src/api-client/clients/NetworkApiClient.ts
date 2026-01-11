import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

/**
 * Singleton class for handling network-related API requests.
 * Extends the AbstractClient class to provide network management functionality.
 */
class NetworkApiClient extends AbstractClient {
    private static instance: NetworkApiClient;
    baseUrl = "/network";

    private constructor() {
        super();
    }

    /**
     * Retrieves the singleton instance of the NetworkApiClient class.
     * If the instance does not already exist, a new instance is created.
     *
     * @return {NetworkApiClient} The singleton instance of NetworkApiClient.
     */
    public static getInstance(): NetworkApiClient {
        if (_.isNil(NetworkApiClient.instance)) {
            NetworkApiClient.instance = new NetworkApiClient();
        }

        return NetworkApiClient.instance;
    }

    /**
     * Fetches all available endpoints from the specified base URL.
     *
     * @return {Promise<AxiosResponse>} A promise that resolves to the AxiosResponse containing all endpoints.
     */
    async allEndpoints(): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/endpoints`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer tous les terminaux.");
            throw error;
        }
    }

    /**
     * Retrieves endpoint data based on the given identifier.
     *
     * @param {string} id - The unique identifier of the endpoint to be fetched.
     * @return {Promise<AxiosResponse>} A promise that resolves with the Axios response containing the endpoint details.
     * @throws Will throw an error if the endpoint cannot be retrieved.
     */
    async getEndpoint(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/endpoints/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer le terminal.");
            throw error;
        }
    }

    /**
     * Sends a request to wake up a specific endpoint.
     *
     * @param {string} id - The identifier of the endpoint to wake.
     * @return {Promise<AxiosResponse>} A promise that resolves with the response from the server.
     */
    async wakeEndpoint(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/endpoints/${id}/wake`);
        } catch (error: any) {
            super.handleError(error,"Impossible de réveiller le terminal.");
            throw error;
        }
    }

    /**
     * Checks if the specified endpoint is alive by sending a GET request to the endpoint's alive URL.
     *
     * @param {string} id - The unique identifier of the endpoint to be checked.
     * @return {Promise<AxiosResponse>} A promise that resolves to the Axios response of the request.
     * @throws Will throw an error if the request fails or the endpoint cannot be reached.
     */
    async isEndpointAlive(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/endpoints/${id}/alive`);
        } catch (error: any) {
            super.handleError(error,"Impossible de vérifier l'état du terminal.");
            throw error;
        }
    }

    /**
     * Updates an endpoint with the given data.
     *
     * @param {string} id - The unique identifier of the endpoint to update.
     * @param {any} data - The data to update the endpoint with.
     * @return {Promise<AxiosResponse>} A promise that resolves to the HTTP response from the update request.
     */
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
