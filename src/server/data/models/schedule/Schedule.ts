import { Document, model, Schema } from 'mongoose';
import * as CronValidator from "cron-validator";
import {ActionDocument, ActionSchema} from "../action/Action";

/**
 * Represents a document that defines a scheduled task or job.
 * Extends the base `Document` interface.
 *
 * @interface ScheduleDocument
 * @property {string} cronExpression - A CRON-formatted string specifying the schedule for the task.
 * @property {ActionDocument} action - The action or task associated with the schedule.
 */
export interface ScheduleDocument extends Document {
    cronExpression: string,
    action: ActionDocument
}

/**
 * ScheduleSchema defines the structure for schedule documents in the database.
 *
 * This schema is responsible for storing schedules with specified cron expressions
 * and their associated actions. It enforces validation rules to ensure proper
 * scheduling configuration.
 *
 * Properties:
 * - `cronExpression`: Represents the cron expression that determines the schedule timing.
 *   This field is required and validated using the `CronValidator.isValidCron` method.
 * - `action`: Represents the associated action to execute at the scheduled time.
 *   It follows the structure defined in the `ActionSchema`.
 */
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
