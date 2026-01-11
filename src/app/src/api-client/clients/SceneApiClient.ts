import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

/**
 * SceneApiClient is a singleton class that provides methods for interacting with the Scene API.
 * It extends AbstractClient and handles CRUD operations as well as other interactions with scene resources.
 * This class is responsible for sending HTTP requests and handling errors related to scene operations.
 */
class SceneApiClient extends AbstractClient {
    private static instance: SceneApiClient;
    baseUrl = "/scene";

    private constructor() {
        super();
    }

    /**
     * Retrieves the singleton instance of the SceneApiClient class.
     * If the instance does not already exist, it initializes a new instance before returning it.
     *
     * @return {SceneApiClient} The singleton instance of SceneApiClient.
     */
    public static getInstance(): SceneApiClient {
        if (_.isNil(SceneApiClient.instance)) {
            SceneApiClient.instance = new SceneApiClient();
        }

        return SceneApiClient.instance;
    }

    /**
     * Retrieves all data from the API endpoint associated with the specified base URL.
     *
     * @return {Promise<any[]>} A promise that resolves to an array of data retrieved from the API.
     * @throws Will throw an error if the API request fails.
     */
    async all(): Promise<any[]> {
        try {
            return (await ApiClient.getInstance().get(`${this.baseUrl}`)).data;
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer toutes les scènes.");
            throw error;
        }
    }

    /**
     * Retrieves data for a specific resource by its ID.
     *
     * @param {string} id - The unique identifier of the resource to be fetched.
     * @return {Promise<AxiosResponse>} A promise that resolves to the AxiosResponse object containing the resource data.
     * @throws Will throw an error if the request fails.
     */
    async get(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer la scène.");
            throw error;
        }
    }

    /**
     * Updates a resource with the specified ID and data.
     *
     * @param {string} id - The unique identifier of the resource to update.
     * @param {any} data - The updated data to apply to the resource.
     * @return {Promise<AxiosResponse>} A promise that resolves to the response from the API.
     */
    async update(id: string, data: any): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().put(`${this.baseUrl}/${id}`, data);
        } catch (error: any) {
            super.handleError(error,"Impossible de mettre à jour la scène.");
            throw error;
        }
    }

    /**
     * Executes a POST request to a specified endpoint using the provided ID and handles potential errors.
     *
     * @param {string} id - The identifier used to construct the endpoint URL.
     * @return {Promise<AxiosResponse>} A promise that resolves with the AxiosResponse object from the API call.
     */
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
