import * as isIp from 'is-ip';
import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

export interface IDaikinAirConditioner {
    name: String,
    ip4: String,
    ip6: String
}

export interface DaikinAirConditionerDocument extends IDaikinAirConditioner, Document { }

export interface DaikinAirCondtionerModel extends Model<DaikinAirConditionerDocument> { }

const DaikinAirConditionerModel = new Schema<DaikinAirConditionerDocument, DaikinAirCondtionerModel>({
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

const DaikinAirConditionner = mongoose.model('DaikinAirConditionner', DaikinAirConditionerModel);

export default DaikinAirConditionner;
