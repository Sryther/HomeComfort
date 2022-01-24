import { Document, model, Schema } from 'mongoose';
import * as CronValidator from "cron-validator";
import ActionSchema, {ActionDocument} from "../action/Action";

export interface ScheduleDocument extends Document {
    cronExpression: string,
    action: ActionDocument
}

const ScheduleSchema = new Schema<ScheduleDocument>({
    cronExpression: {
        type: String,
        validate: CronValidator.isValidCron,
        required: true
    },
    action: ActionSchema
});

const Schedule = model<ScheduleDocument>('Schedule', ScheduleSchema);

export default Schedule;
