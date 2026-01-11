import {Document, model, Schema} from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import {DaikinAirConditionerDocument} from "../air/daikin/AirConditionner";

/**
 * Represents an Event Document that extends a base Document structure.
 * This interface is used to define the schema for an event log, capturing
 * details about interactions with a system.
 *
 * Properties:
 * - `deviceType` (optional): The type of device involved in the event (e.g., mobile, desktop).
 * - `deviceId`: A unique identifier for the device that initiated the event.
 * - `route`: The route or endpoint accessed during the event.
 * - `httpVerb`: The HTTP method used in the interaction (e.g., GET, POST).
 * - `args`: Arguments or payload associated with the event (can be of any type).
 * - `date`: The timestamp, represented as a numeric value, when the event occurred.
 */
export interface EventDocument extends Document {
    deviceType?: string,
    deviceId: string,
    route: string,
    httpVerb: string,
    args: any,
    date: number
}

/**
 * Defines the schema for an event in the system.
 *
 * @typedef {Schema<EventDocument>} EventSchema
 *
 * @property {string} deviceType
 * - The type of device associated with the event.
 * - Optional, defaults to an empty string.
 *
 * @property {string} deviceId
 * - The unique identifier of the device associated with the event.
 * - Required.
 *
 * @property {string} route
 * - The route or endpoint related to the event.
 * - Required.
 *
 * @property {string} httpVerb
 * - The HTTP verb (e.g., GET, POST, PUT, etc.) relevant to the event.
 * - Required.
 *
 * @property {Object} args
 * - Arguments or parameters associated with the event.
 * - Required, defaults to an empty object.
 *
 * @property {number} date
 * - The timestamp or date of the event represented as a number.
 * - Required.
 */
const EventSchema = new Schema<EventDocument>({
    deviceType: {
        type: String,
        required: false,
        default: ""
    },
    deviceId: {
        type: String,
        required: true
    },
    route: {
        type: String,
        required: true
    },
    httpVerb: {
        type: String,
        required: true
    },
    args: {
        type: Object,
        required: true,
        default: {}
    },
    date: {
        type: Number,
        required: true
    }
});

const Event = model<EventDocument>('Event', EventSchema);

export default Event;
