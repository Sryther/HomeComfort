import {Document, model, Schema} from 'mongoose';

import Models from '../../../../lib/xiaomi/models';
import IXiaomiDevice from '../../IXiaomiDevice';

/**
 * Interface representing a Roborock document structure.
 * Combines properties of a Xiaomi device and a document.
 *
 * @interface RoborockDocument
 * @extends IXiaomiDevice
 * @extends Document
 *
 * @property {string} name - The name of the Roborock device.
 * @property {string} type - The type or model of the Roborock device.
 */
export interface RoborockDocument extends IXiaomiDevice, Document {
    name: string,
    type: string
}

/**
 * Schema definition for a Roborock device, representing metadata and configuration
 * related to a specific Roborock unit.
 *
 * Fields:
 * - `name` (String, required): The name assigned to the Roborock device, used for identification.
 * - `token` (String, optional): The token associated with the Roborock device for authentication purposes.
 * - `ip` (String, optional): The IP address of the Roborock device, used for network communication.
 * - `type` (String, required): The model type of the Roborock device. It must be one of the predefined
 *   keys in the `Models` object. Defaults to "default".
 */
const RoborockSchema = new Schema<RoborockDocument>({
    name: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: false
    },
    ip: {
        type: String,
        required: false
    },
    type: {
        type: String,
        enum: Object.keys(Models),
        default: "default",
        required: true
    }
});

const Roborock = model<RoborockDocument>('Roborock', RoborockSchema);

export default Roborock;
