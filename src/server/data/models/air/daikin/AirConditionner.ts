import * as isIp from 'is-ip';
import { Document, Schema, model } from 'mongoose';

/**
 * Interface representing a Daikin Air Conditioner document.
 * Extends the base `Document` interface.
 *
 * Used to define the structure for storing information about a Daikin Air Conditioner.
 *
 * Properties:
 * - `name` (string): The name or identifier of the air conditioner.
 * - `ip4` (string | undefined): The IPv4 address of the air conditioner, if available.
 * - `ip6` (string | undefined): The IPv6 address of the air conditioner, if available.
 */
export interface DaikinAirConditionerDocument extends Document {
    name: string,
    ip4?: string,
    ip6?: string
}

/**
 * Schema definition for the Daikin Air Conditioner entity.
 * Represents the structure of a Daikin Air Conditioner document in the database.
 *
 * @typedef {Schema} DaikinAirConditionerSchema
 *
 * @property {String} name - The name of the air conditioner. This field is required.
 * @property {String} ip4 - The IPv4 address of the air conditioner. This field is optional and validated as a valid IPv4 address.
 * @property {String} ip6 - The IPv6 address of the air conditioner. This field is optional and validated as a valid IPv6 address.
 */
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
