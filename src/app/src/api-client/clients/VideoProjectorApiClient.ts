import ApiClient, {AbstractClient} from "../index";
import _ from "lodash";
import {AxiosResponse} from "axios";

/**
 * A singleton client class for interacting with the Video Projector API, specifically for managing Viewsonic projectors.
 * This class provides methods to retrieve projector data, update projector details, and control projector states.
 *
 * Extends:
 * AbstractClient - Base class providing shared functionality for API clients.
 */
class VideoProjectorApiClient extends AbstractClient {
    private static instance: VideoProjectorApiClient;
    baseUrl = "/video-projector";

    private constructor() {
        super();
    }

    /**
     * Retrieves the singleton instance of the VideoProjectorApiClient.
     * If the instance does not exist, it initializes a new one.
     *
     * @return {VideoProjectorApiClient} The singleton instance of VideoProjectorApiClient.
     */
    public static getInstance(): VideoProjectorApiClient {
        if (_.isNil(VideoProjectorApiClient.instance)) {
            VideoProjectorApiClient.instance = new VideoProjectorApiClient();
        }

        return VideoProjectorApiClient.instance;
    }

    /**
     * Fetches all Viewsonic projectors from the server.
     *
     * @return {Promise<AxiosResponse>} A promise that resolves with the server's response containing all Viewsonic projectors.
     */
    async allViewsonics(): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/viewsonic`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer tous les projecteurs Viewsonic.");
            throw error;
        }
    }

    /**
     * Fetches a Viewsonic projector by its identifier.
     *
     * @param {string} id - The unique identifier of the Viewsonic projector to retrieve.
     * @return {Promise<AxiosResponse>} A promise that resolves to the API response containing the Viewsonic projector data.
     */
    async getViewsonic(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/viewsonic/${id}`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer le projecteur Viewsonic.");
            throw error;
        }
    }

    /**
     * Retrieves the state of a Viewsonic device by its ID.
     *
     * @param {string} id - The unique identifier of the Viewsonic device.
     * @return {Promise<AxiosResponse>} A promise that resolves to the response containing the state of the Viewsonic device.
     */
    async getViewsonicState(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().get(`${this.baseUrl}/viewsonic/${id}/state`);
        } catch (error: any) {
            super.handleError(error,"Impossible de récupérer l'état du projecteur Viewsonic.");
            throw error;
        }
    }

    /**
     * Updates the Viewsonic projector information with the provided data.
     *
     * @param {string} id - The unique identifier of the Viewsonic projector to update.
     * @param {any} data - The data to update the Viewsonic projector with.
     * @return {Promise<AxiosResponse>} A promise that resolves to the response of the update operation.
     */
    async updateViewsonic(id: string, data: any): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().put(`${this.baseUrl}/viewsonic/${id}`, data);
        } catch (error: any) {
            super.handleError(error,"Impossible de mettre à jour le projecteur Viewsonic.");
            throw error;
        }
    }

    /**
     * Sends a request to power on the Viewsonic projector with the specified ID.
     *
     * @param {string} id - The unique identifier of the Viewsonic projector to be powered on.
     * @return {Promise<AxiosResponse>} A promise that resolves with the Axios response after sending the power-on request.
     * @throws Will throw an error if the request fails or an error occurs during execution.
     */
    async powerOnViewsonic(id: string): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().post(`${this.baseUrl}/viewsonic/${id}/power-on`);
        } catch (error: any) {
            super.handleError(error,"Impossible d'allumer le projecteur Viewsonic.");
            throw error;
        }
    }

    /**
     * Sends a request to power off a Viewsonic projector with the specified identifier.
     *
     * @param {string} id - The identifier of the Viewsonic projector to be powered off.
     * @return {Promise<AxiosResponse>} A promise that resolves to the response of the power-off operation.
     * @throws Will throw an error if the power-off operation fails.
     */
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
