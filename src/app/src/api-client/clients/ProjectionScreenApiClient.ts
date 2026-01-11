import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

/**
 * The ProjectionScreenApiClient class is responsible for managing interactions with the Projection Screen API.
 * It extends the AbstractClient class and provides methods for retrieving and manipulating data related to Lumene projection screens.
 */
class ProjectionScreenApiClient extends AbstractClient {
    private static instance: ProjectionScreenApiClient;
    baseUrl = "/projection-screen";

    private constructor() {
        super();
    }

    /**
     * Retrieves the singleton instance of the ProjectionScreenApiClient.
     * Ensures that only one instance of the client is created and reused throughout its lifecycle.
     *
     * @return {ProjectionScreenApiClient} The singleton instance of the ProjectionScreenApiClient.
     */
    public static getInstance(): ProjectionScreenApiClient {
        if (_.isNil(ProjectionScreenApiClient.instance)) {
            ProjectionScreenApiClient.instance = new ProjectionScreenApiClient();
        }

        return ProjectionScreenApiClient.instance;
    }

    /**
     * Fetches all Lumene terminal data from the API.
     *
     * @return {Promise<AxiosResponse>} A promise that resolves to the response from the API containing all Lumene terminal data.
     * @throws Will throw an error if the API request fails.
     */
    async allLumenes(): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/lumene`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer tous les terminaux.");
            throw error;
        }
    }

    /**
     * Fetches lumene data for a given ID.
     *
     * @param {string} id - The unique identifier for the endpoint.
     * @return {Promise<AxiosResponse>} A promise resolving to the Axios response containing the lumene data.
     */
    async getLumene(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/endpoints/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer le terminal.");
            throw error;
        }
    }

    /**
     * Sends a request to "raise" the Lumene screen for the specified ID.
     *
     * @param {string} id - The unique identifier of the Lumene screen to be raised.
     * @return {Promise<AxiosResponse>} A promise resolving to the response of the API call.
     * @throws Will throw an error if the API request fails.
     */
    async upLumene(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/lumene/${id}/up`);
        } catch (error: any) {
            super.handleError(error,"Impossible de remonter la toile Lumene.");
            throw error;
        }
    }

    /**
     * Sends a request to lower the Lumene screen identified by the provided ID.
     *
     * @param {string} id - The identifier of the Lumene screen to be lowered.
     * @return {Promise<AxiosResponse>} A promise that resolves to the Axios response of the request.
     */
    async downLumene(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/lumene/${id}/down`);
        } catch (error: any) {
            super.handleError(error,"Impossible de descendre la toile Lumene.");
            throw error;
        }
    }

    /**
     * Updates the Lumene resource with the specified ID using the provided data.
     *
     * @param {string} id - The unique identifier of the Lumene resource to update.
     * @param {any} data - The data to update the Lumene resource with.
     * @return {Promise<AxiosResponse>} A promise resolving to the Axios response of the update request.
     * @throws Will throw an error if the update operation fails.
     */
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
