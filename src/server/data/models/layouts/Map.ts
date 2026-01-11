import {Document, model, Schema} from 'mongoose';

/**
 * Represents a map document that contains information about a specific floor's map,
 * including its name, SVG representation, and floor number.
 *
 * @interface MapDocument
 * @extends Document
 *
 * @property name - The name or identifier of the map document.
 * @property svg - The SVG (Scalable Vector Graphics) content representing the visual layout of the map.
 * @property floor - The floor number associated with the map, typically used to indicate the level in a building.
 */
export interface MapDocument extends Document {
    name: string,
    svg: string,
    floor: number
}

/**
 * Represents the schema definition for a map document.
 *
 * @typedef {Object} MapSchema
 *
 * @property {String} name - The name of the map. This field is required.
 * @property {String} svg - The SVG representation of the map. This field is required.
 * @property {Number} floor - The floor number associated with the map. This field is required.
 */
const MapSchema = new Schema<MapDocument>({
    name: {
        type: String,
        required: true
    },
    svg: {
        type: String,
        required: true
    },
    floor: {
        type: Number,
        required: true
    }
});

const Map = model<MapDocument>('Map', MapSchema);

export default Map;
