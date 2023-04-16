import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {toast} from 'react-toastify';
import _ from "lodash";

const { API_HOST } = process.env;

class ApiClient {
    private client: AxiosInstance;
    private static instance: ApiClient;

    private constructor() {
        let host = API_HOST;
        if (_.isNil(host)) {
            host = `${document.location.origin.replace(/:[0-9]+/g, "")}:3000`;
        }
        this.client = axios.create({
            baseURL: `${host}/api/`
        });
    }

    public static getInstance(): ApiClient {
        if (_.isNil(this.instance)) {
            this.instance = new ApiClient();
        }

        return this.instance;
    }

    /**
     * @param uri
     * @param config
     * @throws {Error}
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
     * @param uri
     * @param data
     * @param config
     * @throws {Error}
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
     * @param uri
     * @param data
     * @param config
     * @throws {Error}
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
     * @param uri
     * @param data
     * @param config
     * @throws {Error}
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
     * @param uri
     * @param config
     * @throws {Error}
     */
    public async delete(uri: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
        try {
            return await ApiClient.getInstance().client.delete(uri, config);
        } catch (error: any) {
            ApiClient.handleApiError("delete", uri, error);
            throw error;
        }
    }

    private static handleApiError(verb: string, uri: string, error: any) {
        console.error(`Could not ${verb.toUpperCase()} on ${uri}.`, error);
    }
}

export abstract class AbstractClient {
    abstract baseUrl: string;
    notificationsShown: string[] = [];

    /**
     * @throws {Error}
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
