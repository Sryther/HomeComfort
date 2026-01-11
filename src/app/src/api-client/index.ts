import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {toast} from 'react-toastify';
import _ from "lodash";

const { API_HOST } = process.env;

/**
 * Represents a singleton API client for making HTTP requests to a specified backend API.
 * The client is built using Axios and provides methods for various HTTP methods such as GET, POST, PUT, PATCH, and DELETE.
 * Handles API interactions and manages errors consistently.
 */
class ApiClient {
    private client: AxiosInstance;
    private static instance: ApiClient;

    /**
     * A private constructor for initializing an API client instance.
     * It sets up the client with a base URL derived from the document's origin or a default host.
     *
     * @return {void} Does not return any value.
     */
    private constructor() {
        let host = API_HOST;
        if (_.isNil(host)) {
            host = `${document.location.origin.replace(/:[0-9]+/g, "")}:3000`;
        }
        this.client = axios.create({
            baseURL: `${host}/api/`
        });
    }

    /**
     * Retrieves the singleton instance of the ApiClient.
     * If the instance does not exist, it initializes a new ApiClient
     * and assigns it to the instance variable.
     *
     * @return {ApiClient} The singleton instance of the ApiClient.
     */
    public static getInstance(): ApiClient {
        if (_.isNil(this.instance)) {
            this.instance = new ApiClient();
        }

        return this.instance;
    }

    /**
     * Sends a GET request to the specified URI using the provided configuration.
     *
     * @param {string} uri - The endpoint URI to send the GET request to.
     * @param {AxiosRequestConfig} [config] - Optional configuration for the Axios request.
     * @return {Promise<AxiosResponse>} A promise that resolves to the response of the GET request.
     * @throws Will throw an error if the request fails.
     */
    public async get(uri: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().client.get(uri, config);
        } catch (error: any) {
            ApiClient.handleApiError("get", uri, error);
            throw error;
        }
    }

    /**
     * Executes an HTTP PUT request to the specified URI with the provided data and configuration.
     *
     * @param {string} uri - The endpoint URI to send the PUT request to.
     * @param {any} [data] - The data to be sent as the request body. Optional.
     * @param {AxiosRequestConfig} [config] - Optional Axios configuration for the request.
     * @return {Promise<AxiosResponse>} - A promise that resolves with the response of the PUT request.
     * @throws {any} - Throws an error if the request fails. The error is handled internally before re-throwing.
     */
    public async put(uri: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().client.put(uri, data, config);
        } catch (error: any) {
            ApiClient.handleApiError("put", uri, error);
            throw error;
        }
    }

    /**
     * Sends a PATCH request to the specified URI with the provided data and configuration.
     *
     * @param {string} uri - The URI to which the PATCH request is sent.
     * @param {any} [data] - Optional request payload to include in the PATCH request.
     * @param {AxiosRequestConfig} [config] - Optional configuration options for the request.
     * @return {Promise<AxiosResponse>} A promise that resolves with the response of the PATCH request.
     */
    public async patch(uri: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().client.patch(uri, data, config);
        } catch (error: any) {
            ApiClient.handleApiError("patch", uri, error);
            throw error;
        }
    }

    /**
     * Sends an HTTP POST request to the specified URI with the provided data and configuration.
     *
     * @param {string} uri - The endpoint URI to which the request is sent.
     * @param {*} [data] - The data to be sent as the request body. Optional.
     * @param {AxiosRequestConfig} [config] - Additional Axios request configuration options. Optional.
     * @return {Promise<AxiosResponse>} A promise that resolves to the Axios response object.
     * @throws Will throw an error if the HTTP request fails.
     */
    public async post(uri: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().client.post(uri, data, config);
        } catch (error: any) {
            ApiClient.handleApiError("post", uri, error);
            throw error;
        }
    }

    /**
     * Deletes a resource at the specified URI using an HTTP DELETE request.
     *
     * @param {string} uri - The URI of the resource to be deleted.
     * @param {AxiosRequestConfig} [config] - Optional configuration for the request.
     * @return {Promise<AxiosResponse>} A promise that resolves to the response from the server.
     */
    public async delete(uri: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().client.delete(uri, config);
        } catch (error: any) {
            ApiClient.handleApiError("delete", uri, error);
            throw error;
        }
    }

    /**
     * Handles API errors by logging an error message to the console.
     *
     * @param {string} verb - The HTTP verb (e.g., "GET", "POST") associated with the API call.
     * @param {string} uri - The URI endpoint of the API call.
     * @param {any} error - The error object or message returned from the API call.
     * @return {void} Nothing is returned by this method.
     */
    private static handleApiError(verb: string, uri: string, error: any) {
        console.error(`Could not ${verb.toUpperCase()} on ${uri}.`, error);
    }
}

/**
 * Abstract base class for implementing client logic.
 * This class is intended to be extended by concrete implementations.
 */
export abstract class AbstractClient {
    abstract baseUrl: string;
    notificationsShown: string[] = [];

    /**
     * Handles an error by displaying a notification message and managing the notification visibility.
     *
     * @param {AxiosError} error - The error object encountered during an Axios request.
     * @param {string} message - The message to be displayed in the notification.
     * @return {void}
     */
    protected handleError(error: AxiosError, message: string) {
        if (!this.notificationsShown.includes(message)) {
            this.notificationsShown.push(message);
            setTimeout(() => {
                this.notificationsShown.slice(this.notificationsShown.indexOf(message), 1);
            }, 60000); // 1 hour

            toast(`${message}`);
        }
    }
}

export default ApiClient;
