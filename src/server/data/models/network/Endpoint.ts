import * as isIp from 'is-ip';
import { isMACAddress } from 'is-mac-address';
import {Document, model, Schema} from 'mongoose';

export interface EndpointDocument extends Document {
    name: string,
    ip4?: string,
    ip6?: string,
    mac: string
}

const EndpointSchema = new Schema<EndpointDocument>({
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
    },
    mac: {
        type: String,
        validate: isMACAddress,
        required: true
    }
});

const Endpoint = model<EndpointDocument>('Endpoint', EndpointSchema);

export default Endpoint;
