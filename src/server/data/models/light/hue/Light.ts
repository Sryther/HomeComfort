import {Document, model, Schema, Types} from 'mongoose';

export interface LightDocument extends Document {
    idHue: string,
    name: string,
    state?: any,
    bridge: Types.ObjectId,
    productname?: string
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
