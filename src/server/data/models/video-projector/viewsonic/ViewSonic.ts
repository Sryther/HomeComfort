import { Document, model, Schema } from 'mongoose';

/**
 * Interface representing a ViewSonic Document.
 * Extends the base Document interface to include additional
 * properties specific to ViewSonic devices.
 *
 * @interface
 * @extends Document
 *
 * @property {string} name - The name of the ViewSonic device or document.
 * @property {string} serialPortPath - The path of the serial port associated with the device.
 */
export interface ViewSonicDocument extends Document {
    name: string,
    serialPortPath: string
}

/**
 * Represents the schema definition for the ViewSonicModel.
 *
 * This schema defines the structure of a ViewSonic document, including
 * required fields such as `name` and `serialPortPath`.
 *
 * Properties:
 * - `name`: A string representing the name of the ViewSonic device. This field is mandatory.
 * - `serialPortPath`: A string containing the path of the serial port associated with the device. This field is mandatory.
 */
const ViewSonicModel = new Schema<ViewSonicDocument>({
    name: {
        type: String,
        required: true
    },
    serialPortPath: {
        type: String,
        required: true
    }
});

const ViewSonic = model<ViewSonicDocument>('ViewSonic', ViewSonicModel);

export default ViewSonic;
