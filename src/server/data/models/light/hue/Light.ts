import {Document, model, Schema, Types} from 'mongoose';

/**
 * Represents a light document that extends the base `Document` interface.
 * This interface contains properties related to a specific lighting device configuration.
 *
 * @interface LightDocument
 * @extends Document
 *
 * @property {string} idHue - The unique identifier for the light in the Hue system.
 * @property {string} name - The name of the light.
 * @property {any} [state] - An optional property representing the current state of the light.
 * @property {Types.ObjectId} bridge - The ObjectId reference to the associated bridge device.
 * @property {string} [productname] - An optional property denoting the product name of the light.
 */
export interface LightDocument extends Document {
    idHue: string,
    name: string,
    state?: any,
    bridge: Types.ObjectId,
    productname?: string
}

/**
 * Schema definition for LightSchema.
 * Represents a structure for storing information about a light device.
 *
 * @typedef {Schema<LightDocument>} LightSchema
 * @property {String} idHue            - Unique identifier for the light, typically provided by the Hue system. Required.
 * @property {String} name             - User-defined name of the light. Required.
 * @property {Object} [state]          - Current state of the light, such as on/off or brightness. Optional.
 * @property {Schema.Types.ObjectId} bridge - Reference to the bridge associated with the light. Required.
 * @property {String} [productname]    - Name of the product model associated with the light. Optional.
 */
const LightSchema = new Schema<LightDocument>({
    idHue: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    state: {
        type: Object,
        required: false
    },
    bridge: {
        type: Schema.Types.ObjectId,
        required: true
    },
    productname: {
        type: String,
        required: false
    }
});

const Light = model<LightDocument>('Light', LightSchema);

export default Light;
