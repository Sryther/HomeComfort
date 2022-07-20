import {Document, model, Schema} from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import {DaikinAirConditionerDocument} from "../air/daikin/AirConditionner";

export interface EventDocument extends Document {
    deviceType?: string,
    deviceId: string,
    route: string,
    httpVerb: string,
    args: any,
    date: number
}

const EventSchema = new Schema<EventDocument>({
    deviceType: {
        type: String,
        required: false,
        default: ""
    },
    deviceId: {
        type: String,
        required: true
    },
    route: {
        type: String,
        required: true
    },
    httpVerb: {
        type: String,
        required: true
    },
    args: {
        type: Object,
        required: true,
        default: {}
    },
    date: {
        type: Number,
        required: true
    }
});

const Event = model<EventDocument>('Event', EventSchema);

export default Event;
