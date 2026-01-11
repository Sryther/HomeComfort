import { Document, model, Schema } from 'mongoose';

/**
 * LumeneDocument is an interface that extends the base Document interface.
 * It represents a specific type of document with additional properties related
 * to identifying and connecting to a hardware serial port.
 *
 * Properties:
 *
 * - name: A string representing the name of the document or resource.
 * - serialPortPath: A string specifying the path to the serial port associated
 *   with this document.
 */
export interface LumeneDocument extends Document {
    name: string,
    serialPortPath: string
}

/**
 * LumeneSchema defines the structure for the LumeneDocument model.
 * It specifies the required fields and their types.
 *
 * Fields:
 * - name: Represents the name associated with the Lumene document. It is a required string.
 * - serialPortPath: Represents the path to the serial port. It is a required string.
 */
const LumeneSchema = new Schema<LumeneDocument>({
    name: {
        type: String,
        required: true
    },
    serialPortPath: {
        type: String,
        required: true
    }
});

const Lumene = model<LumeneDocument>('Lumene', LumeneSchema);

export default Lumene;
