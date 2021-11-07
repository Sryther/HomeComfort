import * as isIp from 'is-ip';
import { isMACAddress } from 'is-mac-address';
import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

export interface IEndpoint {
    name: String,
    ip4: String,
    ip6: String,
    mac: String
}

export interface EndpointDocument extends IEndpoint, Document { }

export interface EndpointModel extends Model<EndpointDocument> { }

const EndpointSchema = new Schema<EndpointDocument, EndpointModel>({
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

const Endpoint = mongoose.model('Endpoint', EndpointSchema);

export default Endpoint;
