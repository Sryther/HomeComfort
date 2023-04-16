import {Document, model, Schema} from 'mongoose';
import * as isIp from "is-ip";

export interface BridgeDocument extends Document {
    name?: string,
    ip: string,
    user?: string,
    clientKey?: string
}

const BridgeSchema = new Schema<BridgeDocument>({
    name: {
        type: String,
        required: false
    },
    ip: {
        type: String,
        validate: isIp.v4,
        required: true
    },
    user: {
        type: String,
        required: false
    },
    clientKey: {
        type: String,
        required: false
    }
});

const Bridge = model<BridgeDocument>('Bridge', BridgeSchema);

export default Bridge;
