import { Document, model, Schema } from 'mongoose';
import * as CronValidator from "cron-validator";
import {Method} from "axios";

export interface ScheduleDocument extends Document {
    cronExpression: string,
    deviceType: string,
    deviceId: string,
    description: string,
    route: string,
    httpVerb?: Method,
    args?: any
}

const ScheduleSchema = new Schema<ScheduleDocument>({
    description: {
        type: String,
        required: true
    },
    deviceType: {
        type: String,
        required: true
    },
    deviceId: {
        type: String,
        required: true
    },
    cronExpression: {
        type: String,
        validate: CronValidator.isValidCron,
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

const Schedule = model<ScheduleDocument>('Schedule', ScheduleSchema);

export default Schedule;
