import {Document, model, Schema, Types} from 'mongoose';

export interface LightDocument extends Document {
    idHue: string,
    name: string,
    state?: any,
    bridge: Types.ObjectId
}

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
        type: Types.ObjectId,
        required: true
    }
});

const Light = model<LightDocument>('Light', LightSchema);

export default Light;
