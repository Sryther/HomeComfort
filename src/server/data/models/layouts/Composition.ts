import {Document, model, Schema, Types} from 'mongoose';

/**
 * Represents a composition document that extends the base Document interface.
 *
 * The `CompositionDocument` interface is used to define the structure of a document
 * containing information related to compositions. It includes properties for the
 * composition name and associated maps.
 *
 * Properties:
 * @property {string} name - The name of the composition.
 * @property {[Types.ObjectId]} maps - An array of ObjectId references linked to the composition.
 */
export interface CompositionDocument extends Document {
    name: string,
    maps: [Types.ObjectId],
}

/**
 * Schema definition for a composition document in a MongoDB database.
 *
 * Represents a composition entity where:
 * - `name` is the name of the composition and is required.
 * - `maps` is an array of ObjectIds, typically referencing other documents, and is required.
 *
 * This schema enforces the structure of a composition document and ensures data integrity.
 */
const CompositionSchema = new Schema<CompositionDocument>({
    name: {
        type: String,
        required: true
    },
    maps: {
        type: [Types.ObjectId],
        required: true
    }
});

const Composition = model<CompositionDocument>('Composition', CompositionSchema);

export default Composition;
