import {Document, model, Schema} from 'mongoose';
import * as isIp from "is-ip";

/**
 * Represents a bridge document that extends the base `Document` interface.
 * This interface is designed to store configuration and connection details
 * for a bridge device.
 *
 * @interface BridgeDocument
 * @extends Document
 *
 * @property {string} [name] - Optional name of the bridge.
 * @property {string} ip - IP address of the bridge. This field is mandatory.
 * @property {string} [user] - Optional username for authentication with the bridge.
 * @property {string} [clientKey] - Optional client key associated with the bridge for secure communication.
 */
export interface BridgeDocument extends Document {
    name?: string,
    ip: string,
    user?: string,
    clientKey?: string
}

/**
 * Schema definition for a Bridge document.
 *
 * Represents the structure of the Bridge data model, defining fields and their validation rules.
 *
 * @variable {Schema<BridgeDocument>} BridgeSchema - The schema for Bridge documents.
 * @property {String} name - The name of the bridge. This field is optional.
 * @property {String} ip - The IPv4 address of the bridge. This field is required and must pass IPv4 validation.
 * @property {String} user - The user associated with the bridge. This field is optional.
 * @property {String} clientKey - The client key for the bridge. This field is optional.
 */
const BridgeSchema = new Schema<BridgeDocument>({
    name: {
        type: String,
        required: false
    },
    ip: {
        type: String,
        validate: isIp.v4,
        required: true
    },
    user: {
        type: String,
        required: false
    },
    clientKey: {
        type: String,
        required: false
    }
});

const Bridge = model<BridgeDocument>('Bridge', BridgeSchema);

export default Bridge;
