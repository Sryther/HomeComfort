import ApiClient, { AbstractClient } from "../index";
import _ from "lodash";

/**
 * A client class for interacting with the schedule-related API endpoints.
 * This class provides methods to perform CRUD operations on schedules and retrieve schedules for specific devices.
 * It is implemented as a singleton to ensure only one instance is created during the application lifecycle.
 * Extends the `AbstractClient` class for base functionality such as error handling.
 */
class ScheduleApiClient extends AbstractClient {
    private static instance: ScheduleApiClient;
    baseUrl = "/schedule";

    private constructor() {
        super();
    }

    /**
     * Provides a singleton instance of the ScheduleApiClient class. If the instance has not been created yet,
     * this method initializes it. Subsequent calls will return the same instance.
     *
     * @return {ScheduleApiClient} The singleton instance of the ScheduleApiClient class.
     */
    public static getInstance(): ScheduleApiClient {
        if (_.isNil(ScheduleApiClient.instance)) {
            ScheduleApiClient.instance = new ScheduleApiClient();
        }
        return ScheduleApiClient.instance;
    }

    /**
     * Retrieves all data from the specified API endpoint.
     *
     * @return {Promise<any[]>} A promise that resolves to an array of data retrieved from the API.
     * @throws Will throw an error if the API request fails.
     */
    async all(): Promise<any[]> {
        try {
            const res = await ApiClient.getInstance().get(this.baseUrl);
            return res.data;
        } catch (error: any) {
            super.handleError(error, "Impossible de récupérer les programmes.");
            throw error;
        }
    }

    /**
     * Sends a POST request to create a new schedule using the provided data.
     *
     * @param {any} schedule - The schedule data to be created.
     * @return {Promise<any>} A promise that resolves with the response data of the created schedule.
     * @throws Will throw an error if the creation fails or if an error occurs during the request.
     */
    async create(schedule: any): Promise<any> {
        try {
            const res = await ApiClient.getInstance().post(this.baseUrl, schedule);
            return res.data;
        } catch (error: any) {
            super.handleError(error, "Impossible de créer le programme.");
            throw error;
        }
    }

    /**
     * Removes an item by its identifier.
     *
     * @param {string} id - The identifier of the item to be removed.
     * @return {Promise<void>} A promise that resolves when the item is successfully removed.
     */
    async remove(id: string): Promise<void> {
        try {
            await ApiClient.getInstance().delete(`${this.baseUrl}/${id}`);
        } catch (error: any) {
            super.handleError(error, "Impossible de supprimer le programme.");
            throw error;
        }
    }

    /**
     * Retrieves a list of programs for the specified device.
     *
     * @param {string} deviceType - The type of the device (e.g., "thermostat", "light").
     * @param {string} deviceId - The unique identifier of the device.
     * @return {Promise<any[]>} A promise that resolves to an array of programs for the specified device.
     * @throws Will throw an error if the request fails or data retrieval is not possible.
     */
    async forDevice(deviceType: string, deviceId: string): Promise<any[]> {
        try {
            const res = await ApiClient.getInstance().get(`${this.baseUrl}/devices/${deviceType}/${deviceId}`);
            return res.data;
        } catch (error: any) {
            super.handleError(error, "Impossible de récupérer les programmes de l'équipement.");
            throw error;
        }
    }
}

export default ScheduleApiClient;
