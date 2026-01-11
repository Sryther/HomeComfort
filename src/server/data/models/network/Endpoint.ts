import * as isIp from 'is-ip';
import { isMACAddress } from 'is-mac-address';
import {Document, model, Schema} from 'mongoose';

/**
 * Represents a network endpoint document with IPv4, IPv6 addresses, gateways, and other related properties.
 * This interface extends the base Document type.
 *
 * Properties:
 * - `name`: The name of the endpoint.
 * - `ip4` (optional): The IPv4 address of the endpoint.
 * - `ip6` (optional): The IPv6 address of the endpoint.
 * - `gateway4` (optional): The IPv4 address of the gateway for this endpoint.
 * - `gateway6` (optional): The IPv6 address of the gateway for this endpoint.
 * - `port`: The port number associated with the endpoint.
 * - `mac`: The MAC address of the endpoint.
 */
export interface EndpointDocument extends Document {
    name: string,
    ip4?: string,
    ip6?: string,
    gateway4?: string,
    gateway6?: string,
    port: number,
    mac: string
}

/**
 * Defines the schema for an Endpoint document.
 *
 * This schema is used to represent endpoint configuration details in the database.
 * An endpoint typically includes identification information, IP addresses, network gateways,
 * port configuration, and a MAC address.
 *
 * Schema Fields:
 * - name: The name of the endpoint (required).
 * - ip4: The IPv4 address of the endpoint, validated as a proper IPv4 address (optional).
 * - ip6: The IPv6 address of the endpoint, validated as a proper IPv6 address (optional).
 * - gateway4: The IPv4 gateway address, validated as a proper IPv4 address (optional).
 * - gateway6: The IPv6 gateway address, validated as a proper IPv6 address (optional).
 * - port: The port number associated with the endpoint (optional).
 * - mac: The MAC address for the endpoint, validated as a proper MAC address (required).
 */
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
    gateway4: {
        type: String,
        validate: isIp.v4,
        required: false
    },
    gateway6: {
        type: String,
        validate: isIp.v6,
        required: false
    },
    port: {
        type: Number,
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
