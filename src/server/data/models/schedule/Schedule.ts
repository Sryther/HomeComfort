import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';
import * as CronValidator from "cron-validator";
import {Method} from "axios";

export interface ISchedule {
    cronExpression: string,
    deviceType: string,
    deviceId: string,
    description: string,
    route: string,
    httpVerb: Method,
    args: any
}

export interface ScheduleDocument extends ISchedule, Document { }

export interface ScheduleModel extends Model<ScheduleDocument> { }

const ScheduleSchema = new Schema<ScheduleDocument, ScheduleModel>({
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

const Schedule = mongoose.model('Schedule', ScheduleSchema);

export default Schedule;
