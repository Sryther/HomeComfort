import {Document, model, Schema} from 'mongoose';

export interface MapDocument extends Document {
    name: string,
    svg: string,
    floor: number
}

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
