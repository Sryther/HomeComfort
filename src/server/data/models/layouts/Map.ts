import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

export interface IMap {
    name: String,
    svg: String,
    floor: number
}

export interface MapDocument extends IMap, Document { }

export interface MapModel extends Model<MapDocument & Document> { }

const MapSchema = new Schema<MapDocument, MapModel>({
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

const Map = mongoose.model('Map', MapSchema);

export default Map;
