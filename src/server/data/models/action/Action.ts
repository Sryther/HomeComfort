import {Schema} from "mongoose";
import { v4 as uuidv4 } from 'uuid';

export interface ActionDocument {
    deviceType?: string,
    deviceId: string,
    description?: string,
    route: string,
    httpVerb?: string,
    args?: any,
    order?: number,
    _id?: string
}

const ActionSchema = new Schema<ActionDocument>({
    deviceType: {
        type: String,
        required: false,
        default: ""
    },
    deviceId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    route: {
        type: String,
        required: true
    },
    httpVerb: {
        type: String,
        required: false,
        default: "POST"
    },
    args: {
        type: Object,
        required: false
    },
    order: {
        type: Number,
        required: false,
        default: 0
    },
    _id: {
        type: String,
        default: () => uuidv4(),
        required: false
    }
});

export default ActionSchema;
