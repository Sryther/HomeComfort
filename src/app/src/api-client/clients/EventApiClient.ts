import ApiClient, { AbstractClient } from "../index";
import _ from "lodash";

/**
 * The EventApiClient class is a singleton client for interacting with the Event API.
 * It provides methods to retrieve event-related data by leveraging the API endpoints.
 * This class extends the AbstractClient, inheriting its error-handling and utility mechanisms.
 */
class EventApiClient extends AbstractClient {
    private static instance: EventApiClient;
    baseUrl = "/event";

    private constructor() {
        super();
    }

    /**
     * Retrieves the singleton instance of the EventApiClient class.
     * If an instance does not already exist, it creates a new one.
     *
     * @return {EventApiClient} The singleton instance of EventApiClient.
     */
    public static getInstance(): EventApiClient {
        if (_.isNil(EventApiClient.instance)) {
            EventApiClient.instance = new EventApiClient();
        }
        return EventApiClient.instance;
    }

    /**
     * Fetches the latest data entries from the API.
     *
     * @param {number} [limit=200] - The maximum number of entries to retrieve.
     * @return {Promise<any[]>} A promise that resolves to an array of the latest data entries.
     * @throws {Error} Throws an error if the data retrieval fails.
     */
    async latest(limit: number = 200): Promise<any[]> {
        try {
            return (await ApiClient.getInstance().get(`${this.baseUrl}/latest?limit=${limit}`)).data;
        } catch (error: any) {
            super.handleError(error, "Impossible de récupérer l'historique.");
            throw error;
        }
    }
}

export default EventApiClient;
