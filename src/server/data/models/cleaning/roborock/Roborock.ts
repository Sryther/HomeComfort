import {Document, model, Schema} from 'mongoose';

import Models from '../../../../lib/xiaomi/models';
import IXiaomiDevice from '../../IXiaomiDevice';

export interface RoborockDocument extends IXiaomiDevice, Document {
    name: string,
    type: string
}

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
