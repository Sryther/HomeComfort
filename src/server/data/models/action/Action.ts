import {Document, model, Schema} from "mongoose";
import { v4 as uuidv4 } from 'uuid';

/**
 * Represents an action document that extends the base Document interface.
 * This interface is used to describe an action's metadata and its related properties.
 *
 * @interface ActionDocument
 * @extends Document
 *
 * @property {string} [deviceType] - Specifies the type of the device associated with the action. This is optional.
 * @property {string} deviceId - The unique identifier of the device related to the action. This is required.
 * @property {string} [description] - An optional description of the action.
 * @property {string} route - The endpoint or path associated with the action. This is required.
 * @property {string} [httpVerb] - The HTTP verb (e.g., GET, POST, PUT, DELETE) used for the action. This is optional.
 * @property {any} [args] - Optional arguments or parameters required for executing the action.
 * @property {number} [order] - Specifies the order or priority of the action. This is optional.
 * @property {string} [_id] - An optional unique identifier for the action document.
 */
export interface ActionDocument extends Document {
    deviceType?: string,
    deviceId: string,
    description?: string,
    route: string,
    httpVerb?: string,
    args?: any,
    order?: number,
    _id?: string
}

/**
 * Schema definition for an Action document.
 *
 * Represents an action that can be performed, typically in the context of an API route or device interaction.
 *
 * Fields:
 * - deviceType: Specifies the type of device associated with the action. Defaults to an empty string.
 * - deviceId: The unique identifier of the device. This field is required.
 * - description: A textual description of the action. Defaults to an empty string.
 * - route: The API route or endpoint associated with the action. This field is required.
 * - httpVerb: The HTTP method (e.g., POST, GET, PUT, DELETE) used for the action. Defaults to "POST".
 * - args: A collection of arguments or parameters for the action. Defaults to an empty object.
 * - order: Specifies the execution order or priority of the action. Defaults to 0.
 * - _id: The unique identifier for the action document, automatically generated using a UUID. Not required to be provided manually.
 */
export const ActionSchema = new Schema<ActionDocument>({
    deviceType: {
        type: String,
        required: false,
        default: ""
    },
    deviceId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    route: {
        type: String,
        required: true
    },
    httpVerb: {
        type: String,
        required: false,
        default: "POST"
    },
    args: {
        type: Object,
        required: false,
        default: {}
    },
    order: {
        type: Number,
        required: false,
        default: 0
    },
    _id: {
        type: String,
        default: () => uuidv4(),
        required: false
    }
});

const Action = model<ActionDocument>('Action', ActionSchema);

export default Action;
