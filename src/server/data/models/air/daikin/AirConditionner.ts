import * as isIp from 'is-ip';
import { Document, Schema, model } from 'mongoose';

export interface DaikinAirConditionerDocument extends Document {
    name: string,
    ip4?: string,
    ip6?: string
}

const DaikinAirConditionerSchema = new Schema<DaikinAirConditionerDocument>({
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

const DaikinAirConditioner = model<DaikinAirConditionerDocument>('DaikinAirConditioner', DaikinAirConditionerSchema);

export default DaikinAirConditioner;
