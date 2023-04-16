import Cron from 'cron';
import {ObjectId} from "mongoose";
import cronstrue from 'cronstrue/i18n';
import axios, {Method, AxiosRequestConfig} from "axios";

import Schedule, {ScheduleDocument} from '../../data/models/schedule/Schedule';
import Config from '../../config';
import {SceneDocument} from "../../data/models/scene/Scene";
import {ActionDocument} from "../../data/models/action/Action";

const addSchedule = async (deviceType: string | undefined, deviceId: ObjectId | string | undefined, cronExpression: string, description: string, route: string, httpVerb: string, args: any): Promise<ScheduleDocument> => {
    const schedule = new Schedule({
        cronExpression: cronExpression,
        description: cronstrue.toString(cronExpression, {locale: "fr"}) + "\n" + description,
        action: {
            deviceType: deviceType,
            deviceId: deviceId,
            route: route,
            httpVerb: httpVerb,
            args: args
        }
    });

    if (schedule.action.args === undefined || schedule.action.args === null) {
        delete schedule.action.args;
    }

    console.log(`Saving schedule for device ${schedule.action.deviceId} (${schedule.action.deviceType}): ${schedule.action.description}.`);

    await schedule.save();

    return schedule;
}

const removeSchedule = async (id: string): Promise<boolean> => {
    const schedule = await Schedule.findById(id);
    if (schedule) {
        console.log(`Deleting schedule ${schedule._id} for device ${schedule.action.deviceId} (${schedule.action.deviceType}): ${schedule.action.description}.`);
        schedule.remove();
    }
    return false;
}

export default class CRONManager {
    static cronjobs: Map<string, Cron.CronJob> = new Map();

    static axiosInstance = axios.create({
        baseURL: `http://127.0.0.1:${Config.api.port}`
    });

    static async launchJobs() {
        const schedules = await Schedule.find();

        if (schedules.length === 0) {
            console.log("No scheduled task found.");
        }

        for (const schedule of schedules) {
            const job = new Cron.CronJob(schedule.cronExpression, async () => {
                return this.runJob(schedule);
            });

            job.start();

            this.cronjobs.set(schedule._id, job);
        }
    }

    static async runAction(action: ActionDocument) {
        try {
            console.log(`Invoking route ${action.httpVerb} ${action.route} with arguments: ${JSON.stringify(action.args)}`);

            const verb: Method = action.httpVerb as unknown as Method;
            const requestConfig: AxiosRequestConfig = {
                method: verb,
                url: action.route,
                headers: {
                    "helix": "self"
                }
            };

            if (action.args) {
                if (action.httpVerb === "get" || action.httpVerb === "GET") {
                    requestConfig.params = action.args;
                } else {
                    requestConfig.data = action.args;
                }
            }
            return await this.axiosInstance.request(requestConfig);
        } catch (error: any) {
            return Promise.reject(error);
        }
    }

    static async runJob(schedule: ScheduleDocument) {
        return await this.runAction(schedule.action);
    }

    static async runScene(scene: SceneDocument) {
        if (scene.actions !== undefined) {
            return Promise.all(scene.actions.map(this.runAction.bind(this)));
        } else {
            return Promise.resolve(null);
        }
    }

    static async addJob(deviceType: string | undefined, deviceId: ObjectId | string | undefined, cronExpression: string, description: string, route: string, httpVerb: string, args: any): Promise<ScheduleDocument | null> {
        try {
            const schedule = await addSchedule(deviceType, deviceId, cronExpression, description, route, httpVerb, args);

            const job = new Cron.CronJob(cronExpression, () => {
                return this.runJob(schedule);
            });

            job.start();

            this.cronjobs.set(schedule._id, job);

            return schedule;
        } catch (error) {
            console.error(`Couldn't save schedule for ${deviceType} ${deviceId} with CRON expression '${cronExpression}'`, error);
            throw error;
        }
    }

    static async removeJob(id: string): Promise<boolean> {
        try {
            await removeSchedule(id);

            if (this.cronjobs.has(id)) {
                const job = this.cronjobs.get(id);
                if (job !== undefined) {
                    job.stop();

                    this.cronjobs.delete(id);
                    return true;
                }
            }
            return false;
        } catch (e) {
            console.error(`Couldn't remove schedule ${id}`, e);
            return false;
        }
    }
}
