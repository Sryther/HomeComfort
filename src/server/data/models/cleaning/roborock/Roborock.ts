import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

import Models from '../../../../lib/xiaomi/models';
import IXiaomiDevice from '../../IXiaomiDevice';

export interface IRoborock extends IXiaomiDevice {
    name: string,
    type: string
}

export interface RoborockDocument extends IRoborock, Document { }

export interface RoborockModel extends Model<RoborockDocument> { }

const RoborockSchema = new Schema<RoborockDocument, RoborockModel>({
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

const Roborock = mongoose.model('Roborock', RoborockSchema);

export default Roborock;
