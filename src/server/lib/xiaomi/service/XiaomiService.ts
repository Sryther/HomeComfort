import crypto from "crypto";
import axios, { AxiosResponse } from "axios";
import _ from "lodash";
import miio from "miio";
import { ungzip } from "node-gzip";

import { RoborockDocument } from "../../../data/models/cleaning/roborock/Roborock";
import IXiaomiDevice from "../../../data/models/IXiaomiDevice";
import RRMapParser from "./RRMapParser";
import Map from "../models/entities/map/Map";

const XIAOMI_BASE_URL = "https://account.xiaomi.com";

const AVAILABLE_COUNTRIES = ["de", "us", "ru", "tw", "sg", "in", "i2", "cn"];

interface AuthenticationSession {
    sign: string,
    ssecurity: string,
    userId: string,
    cUserId: string,
    passToken: string,
    location: string,
    code: string,
    serviceToken: string,
    userAgent: string
}

const sleep = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

class XiaomiService {
    axiosInstance: any;

    authenticationSession: AuthenticationSession = {
        sign: "",
        ssecurity: "",
        userId: "",
        cUserId: "",
        passToken: "",
        location: "",
        code: "",
        serviceToken: "",
        userAgent: ""
    };

    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = crypto.createHash('md5').update(password).digest("hex");
    }

    /**
     * The full login procedure.
     * @private
     */
    private async login() {
        this.setUserAgent(XiaomiService.generateUserAgent());
        const mockDeviceId = XiaomiService.generateDeviceId();

        this.axiosInstance = axios.create({
            baseURL: XIAOMI_BASE_URL,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": this.getUserAgent(),
                "Cookie": `sdkVersion=accountsdk-18.8.15; deviceId=${mockDeviceId}; userId=${this.username}`
            }
        });

        return await this.loginSign() && await this.loginAuth() && await this.loginRightPlace();
    }

    /**
     * Login to retrieve sign token.
     * @private
     */
    private async loginSign(): Promise<boolean> {
        const result = await this.axiosInstance.get("/pass/serviceLogin?sid=xiaomiio&_json=true");
        const parsedResult = JSON.parse(result.data.replace("&&&START&&&", ""));
        this.setSign(parsedResult._sign);

        return Promise.resolve(true);
    }

    /**
     * Login to get ssecurity, userId, cUserId, passToken, location and code information.
     * @private
     */
    private async loginAuth(): Promise<boolean> {
        const params = new URLSearchParams();
        params.append("sid", "xiaomiio");
        params.append("hash", this.password.toUpperCase());
        params.append("callback", "https://sts.api.io.mi.com/sts");
        params.append("qs", "%3Fsid%3Dxiaomiio%26_json%3Dtrue");
        params.append("user", this.username);
        params.append("_sign", this.getSign());
        params.append("_json", "true");

        const result = await this.axiosInstance.post("/pass/serviceLoginAuth2", params);
        const parsedResult = JSON.parse(result.data.replace("&&&START&&&", ""));
        this.setSsecurity(parsedResult.ssecurity);
        this.setUserId(parsedResult.userId);
        this.setCUserId(parsedResult.cUserId);
        this.setPassToken(parsedResult.passToken);
        this.setLocation(parsedResult.location);
        this.setCode(parsedResult.code);

        return Promise.resolve(true);
    }

    private async loginRightPlace(): Promise<boolean> {
        const result = await axios.get(this.getLocation(), {
            headers: {
                "User-Agent": this.getUserAgent(),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        this.setServiceToken(_.find(result.headers['set-cookie'], cookie => cookie.includes("serviceToken"))
            .replace("serviceToken=", "")
            .replace(/;.*/g, ""));

        return Promise.resolve(true);
    }

    /**
     * Get the best country for the Xiaomi device.
     * @param device
     */
    async getDeviceCountry(device: IXiaomiDevice): Promise<string> {
        const isLogged = await this.login();

        if (isLogged) {
            for (const country of AVAILABLE_COUNTRIES) {
                const url = `https://${country}.api.io.mi.com/app/home/device_list`;
                const data = '{"getVirtualModel":false,"getHuamiDevices":0}';
                const auth = this.createSignature("/home/device_list", data);

                try {
                    const params = new URLSearchParams();
                    params.append("signature", auth.signature);
                    params.append("_nonce", auth.nonce);
                    params.append("data", data);

                    const result: any = await axios.post(url, params, {
                        headers: this.createHeadersWithCookies()
                    });
                    const devices: any[] = result.data.result.list;

                    const found = devices.filter((d: any) => d.localip === device.ip && d.token === device.token).length > 0;
                    if (found) {
                        return Promise.resolve(country);
                    }
                } catch (e) {
                    console.log(`Query failed for country ${country}.`, e);
                }
            }

            return Promise.reject("Country not found.");
        } else {
            return Promise.reject("Can't authenticate.");
        }
    }

    /**
     * Get the map for a Roborock device.
     * @param roborock
     */
    async getMap(roborock: RoborockDocument): Promise<any> {
        const device = await miio.device({ address: roborock.ip, token: roborock.token });
        const country = await this.getDeviceCountry(roborock);

        const asyncLoopToGetMapParam = async () => {
            let map = "retry";
            let i = 0;
            while (map === "retry") {
                map = (await device.miioCall("get_map_v1", [Math.trunc(Math.random() * (10000 - 1000) + 1000)]))[0];

                await sleep(1000);

                i++;

                if (i >= 3) {
                    console.log("Couldn't get map url");
                    return Promise.reject();
                }
            }
            return Promise.resolve(map);
        };

        try {
            const mapUrlParam = await asyncLoopToGetMapParam();

            const url = `https://${country}.api.io.mi.com/app/home/getmapfileurl`;
            const data = `{"obj_name": "${mapUrlParam}"}`;
            const auth = this.createSignature("/home/getmapfileurl", data);
            const params = new URLSearchParams();
            params.append("signature", auth.signature);
            params.append("_nonce", auth.nonce);
            params.append("data", data);

            const result = await axios.post(url, params, {
                headers: this.createHeadersWithCookies()
            });

            const mapUrl = result.data.result.url;

            const response: AxiosResponse = await axios.get(mapUrl, {
                responseType: 'arraybuffer'
            });

            const dataBuffer = response.data;
            const preprocessedMapBuffer = await XiaomiService.preprocessMap(dataBuffer);
            const map: Map | null = RRMapParser.PARSE(preprocessedMapBuffer);

            return Promise.resolve(map);
        } catch (e) {
            console.log("Cannot get map", e);
            return Promise.reject(e);
        }
    }

    /**
     * Create the signature to send legit requests.
     * @param path
     * @param data
     * @private
     */
    private createSignature(path: string, data: any) {
        const nonce = XiaomiService.generateNonce();
        const signedNonce = this.generateSignedNonce(nonce);
        const signature = XiaomiService.generateSignature(path, nonce, signedNonce, data);

        return {
            nonce: nonce,
            signature: signature
        }
    }

    /**
     * Create headers to act like a legit user and not a bot.
     * @private
     */
    private createHeadersWithCookies(): any {
        const cookies = [
            `userId=${this.getUserId()}`,
            `yetAnotherServiceToken: ${this.getServiceToken()}`,
            `serviceToken=${this.getServiceToken()}`,
            `locale=en_GB`,
            `timezone=GMT+02:00`,
            `is_daylight=1`,
            `dst_offset=3600000`,
            `channel=3600000`
        ];

        return {
            "Accept-Encoding": "gzip",
            "User-Agent": this.getUserAgent(),
            "Content-Type": "application/x-www-form-urlencoded",
            "x-xiaomi-protocal-flag-cli": "PROTOCAL-HTTP2",
            "Cookie": cookies.join(";")
        }
    }

    /**
     * Generate a nonce based on timestamp.
     * @private
     */
    private static generateNonce(): string {
        const millis = new Date().getTime();
        const stamp = Math.floor(millis / 60000);

        const randomBytes = crypto.randomBytes(8);
        const bufferStamp = Buffer.alloc(4);
        bufferStamp.writeInt32BE(stamp);

        return Buffer.concat([randomBytes, bufferStamp])
            .toString('base64');
    }

    /**
     * Generate a signed nonce based on the ssecurity token retrieved from login().
     * @param nonce
     * @private
     */
    private generateSignedNonce(nonce: string): string {
        const ssecurityDecoded = Buffer.from(this.getSsecurity(), "base64");
        const nonceDecoded = Buffer.from(nonce, "base64");

        return crypto.createHash('sha256')
            .update(Buffer.concat([ssecurityDecoded, nonceDecoded]))
            .digest()
            .toString("base64");
    }

    /**
     * Generate the full signature based on url, generated nonce and signed nonce then data to send.
     * @param path
     * @param nonce
     * @param signedNonce
     * @param data
     * @private
     */
    private static generateSignature(path: string, nonce: string, signedNonce: string, data: any): string {
        const signatureParams = [
            path,
            signedNonce,
            nonce,
            `data=${data}`
        ];

        const signatureString = signatureParams.join("&");

        return crypto.createHmac('sha256', Buffer.from(signedNonce, "base64"))
            .update(signatureString)
            .digest()
            .toString("base64");
    }

    private static async preprocessMap(data: Buffer): Promise<Buffer> {
        return await ungzip(data);
    }

    /**
     * Generate a random User-Agent to act like an Android phone (OnePlus).
     * @private
     */
    private static generateUserAgent() {
        let agentId = "";
        for (let i = 0; i < 13; i++) {
            agentId += Math.trunc(Math.random() * (69 - 65) + 65);
        }
        return `Android-7.1.1-1.0.0-ONEPLUS A3010-136-${agentId} APP/xiaomi.smarthome APPV/62830`;
    }

    /**
     * Generate a random device id.
     * @private
     */
    private static generateDeviceId() {
        let deviceId = "";
        for (let i = 0; i < 6; i++) {
            deviceId += Math.trunc(Math.random() * (122 - 97) + 97);
        }
        return deviceId;
    }


    private getSign() {
        return this.authenticationSession.sign;
    }

    private getSsecurity() {
        return this.authenticationSession.ssecurity;
    }

    private getUserId() {
        return this.authenticationSession.userId;
    }

    private getCUserId() {
        return this.authenticationSession.cUserId;
    }

    private getPassToken() {
        return this.authenticationSession.passToken;
    }

    private getLocation() {
        return this.authenticationSession.location;
    }

    private getCode() {
        return this.authenticationSession.code;
    }

    private getServiceToken() {
        return this.authenticationSession.serviceToken;
    }

    private getUserAgent() {
        return this.authenticationSession.userAgent;
    }


    private setSign(sign: string) {
        this.authenticationSession.sign = sign;
    }

    private setSsecurity(ssecurity: string) {
        this.authenticationSession.ssecurity = ssecurity;
    }

    private setUserId(userId: string) {
        this.authenticationSession.userId = userId;
    }

    private setCUserId(cUserId: string) {
        this.authenticationSession.cUserId = cUserId;
    }

    private setPassToken(passToken: string) {
        this.authenticationSession.passToken = passToken;
    }

    private setLocation(location: string) {
        this.authenticationSession.location = location;
    }

    private setCode(code: string) {
        this.authenticationSession.code = code;
    }

    private setServiceToken(serviceToken: string) {
        this.authenticationSession.serviceToken = serviceToken;
    }

    private setUserAgent(userAgent: string) {
        this.authenticationSession.userAgent = userAgent;
    }
}

export default XiaomiService;
