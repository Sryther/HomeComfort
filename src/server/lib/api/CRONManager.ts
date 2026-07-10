import Cron from 'cron';
import {ObjectId} from "mongoose";
import cronstrue from 'cronstrue/i18n';
import axios, {Method, AxiosRequestConfig} from "axios";

import Schedule, {ScheduleDocument} from '../../data/models/schedule/Schedule';
import Config from '../../configuration';
import {SceneDocument} from "../../data/models/scene/Scene";
import {ActionDocument} from "../../data/models/action/Action";
import { log } from "../logger";

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
        await schedule.remove();
        return true;
    }
    return false;
}

export default class CRONManager {
    static cronjobs: Map<string, Cron.CronJob> = new Map();

    static axiosInstance = axios.create({
        baseURL: `http://127.0.0.1:${Config.getInstance().getApiPort()}`
    });

    static async launchJobs() {
        const schedules = await Schedule.find();

        if (schedules.length === 0) {
            console.log("No scheduled task found.");
        }

        log.info("CRON", `Found ${schedules.length} schedules`);

        for (const schedule of schedules) {
            log.info("CRON", `Scheduling job id=${schedule._id} cron="${schedule.cronExpression}"`);
            this.register(schedule);
        }
    }

    /**
     * Registers (and starts) a live CronJob for the given schedule, replacing any
     * existing job with the same id. The job map is keyed by the string form of the
     * schedule id so it can be looked up again on removal.
     */
    static register(schedule: ScheduleDocument): Cron.CronJob {
        const id = String(schedule._id);

        const existing = this.cronjobs.get(id);
        if (existing !== undefined) {
            existing.stop();
        }

        const job = new Cron.CronJob(schedule.cronExpression, () => {
            return this.runJob(schedule);
        });
        job.start();

        this.cronjobs.set(id, job);

        return job;
    }

    static async runAction(action: ActionDocument) {
        try {
            console.log(`Invoking route ${action.httpVerb} ${action.route} with arguments: ${JSON.stringify(action.args)}`);

            const verb: Method = action.httpVerb as unknown as Method;

            // Routes are mounted under `/api`, but the axios instance targets the
            // server root (no prefix). Normalise here so stored routes work whether
            // or not they already include the `/api` prefix (idempotent).
            let url = action.route;
            if (!url.startsWith("/api")) {
                url = `/api${url.startsWith("/") ? "" : "/"}${url}`;
            }

            const requestConfig: AxiosRequestConfig = {
                method: verb,
                url: url,
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

            this.register(schedule);

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
