import {Method} from "axios";
import {Schema} from "mongoose";

export interface ActionDocument {
    deviceType: string,
    deviceId: string,
    route: string,
    httpVerb?: Method,
    args?: any
}

const ActionSchema = new Schema<ActionDocument>({
    deviceType: {
        type: String,
        required: true
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
        required: false,
        default: "POST"
    },
    args: {
        type: Object,
        required: false
    }
});

export default ActionSchema;
