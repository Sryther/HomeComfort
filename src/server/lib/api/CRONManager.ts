import Cron from 'cron';
import { ObjectId } from "mongoose";
import cronstrue from 'cronstrue/i18n';
import axios, { AxiosResponse, Method, AxiosRequestConfig } from "axios";

import Schedule, { ScheduleDocument } from '../../data/models/schedule/Schedule';
import Config from '../../config';

const addSchedule = async (deviceType: string, deviceId: ObjectId, cronExpression: string, description: string, route: string, httpVerb: string, args: any): Promise<ScheduleDocument> => {
    const schedule = new Schedule({
        deviceType: deviceType,
        deviceId: deviceId,
        cronExpression: cronExpression,
        description: cronstrue.toString(cronExpression, {locale: "fr"}) + "\n" + description,
        route: route,
        httpVerb: httpVerb,
        args: args
    });

    if (schedule.args === undefined || schedule.args === null) {
        delete schedule.args;
    }

    console.log(`Saving schedule for device ${schedule.deviceId} (${schedule.deviceType}): ${schedule.description}.`);

    await schedule.save();

    return schedule;
}

const removeSchedule = async (id: string): Promise<boolean> => {
    const schedule = await Schedule.findById(id);
    if (schedule) {
        console.log(`Deleting schedule ${schedule._id} for device ${schedule.deviceId} (${schedule.deviceType}): ${schedule.description}.`);
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
        for (const schedule of schedules) {
            const job = new Cron.CronJob(schedule.cronExpression, async () => {
                return this.runJob(schedule);
            });

            job.start();

            this.cronjobs.set(schedule._id, job);
        }
    }

    static async runJob(schedule: ScheduleDocument) {
        console.log(`Invoking route ${schedule.httpVerb} ${schedule.route} with arguments: ${JSON.stringify(schedule.args)}`);
        const requestConfig: AxiosRequestConfig = {
            method: schedule.httpVerb,
            url: schedule.route
        };

        if (schedule.args) {
            if (schedule.httpVerb === "get" || schedule.httpVerb === "GET") {
                requestConfig.params = schedule.args;
            } else {
                requestConfig.data = schedule.args;
            }
        }

        return await this.axiosInstance.request(requestConfig);
    }

    static async addJob(deviceType: string, deviceId: ObjectId, cronExpression: string, description: string, route: string, httpVerb: string, args: any): Promise<string | null> {
        try {
            const schedule = await addSchedule(deviceType, deviceId, cronExpression, description, route, httpVerb, args);

            const job = new Cron.CronJob(cronExpression, () => {
                return this.runJob(schedule);
            });

            job.start();

            this.cronjobs.set(schedule._id, job);

            return schedule._id;
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
