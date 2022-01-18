import * as isIp from 'is-ip';
import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

export interface IDaikinAirConditioner {
    name: string,
    ip4: string,
    ip6: string
}

export interface DaikinAirConditionerDocument extends IDaikinAirConditioner, Document { }

export interface DaikinAirConditionerModel extends Model<DaikinAirConditionerDocument> { }

const DaikinAirConditionerSchema = new Schema<DaikinAirConditionerDocument, DaikinAirConditionerModel>({
    name: {
        type: String,
        required: true
    },
    ip4: {
        type: String,
        validate: isIp.v4,
        required: false
    },
    ip6: {
        type: String,
        validate: isIp.v6,
        required: false
    }
});

const DaikinAirConditionner = mongoose.model('DaikinAirConditionner', DaikinAirConditionerSchema);

export default DaikinAirConditionner;
