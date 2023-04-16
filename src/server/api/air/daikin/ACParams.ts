/**
 * @typedef {Object} ACParams
 * @property {Boolean} power Enable or disable the device, you can also use DaikinAC-Power for allowed values in human readable format
 * @property {Number} mode Set operation Mode of the device, you can also use DaikinAC-Mode for allowed values in human readable format
 * @property {Number|String} targetTemperature Float or "M" for mode 2 (DEHUMDIFICATOR)
 * @property {Number|String} targetHumidity Float or "AUTO"/"--" for mode 6 (FAN)
 * @property {Number} fanRate Integer or "A"/"B", you can also use DaikinAC-FanRate for allowed values in human readable format
 * @property {Number} fanDirection Integer, you can also use DaikinAC-FanDirection for allowed values in human readable format
 */

export default class ACParams {
    private _power: Boolean|null = null;
    private _mode: Number|String|null = null;
    private _specialMode: Number|String|null = null;
    private _specialModeActive: Boolean|Number|null = null;
    private _targetTemperature: Number|String|null = null;
    private _targetHumidity: Number|String|null = null;
    private _fanRate: Number|null = null;
    private _fanDirection: Number|null = null;

    constructor() { }

    toObject(): any {
        const returnValue: any = {
            power: this.power,
            mode: this.mode,
            specialMode: this.specialMode,
            specialModeActive: this.specialModeActive,
            targetTemperature: this.targetTemperature,
            targetHumidity: this.targetHumidity,
            fanRate: this.fanRate,
            fanDirection: this.fanDirection
        };

        // Clean null or undefined values
        for (const key of Object.keys(returnValue)) {
            if (returnValue[key] === undefined || returnValue[key] === null) {
                delete returnValue[key];
            }
        }

        return returnValue;
    }

    get power() {
        return this._power;
    }

    set power(value) {
        this._power = value;
    }

    get mode() {
        return this._mode;
    }

    set mode(value) {
        this._mode = value;
    }

    get specialMode() {
        return this._specialMode;
    }

    set specialMode(value) {
        this._specialMode = value;
    }

    get specialModeActive() {
        return this._specialModeActive;
    }

    set specialModeActive(value) {
        this._specialModeActive = value;
    }

    get targetTemperature() {
        return this._targetTemperature;
    }

    set targetTemperature(value) {
        this._targetTemperature = value;
    }

    get targetHumidity() {
        return this._targetHumidity;
    }

    set targetHumidity(value) {
        this._targetHumidity = value;
    }

    get fanRate() {
        return this._fanRate;
    }

    set fanRate(value) {
        this._fanRate = value;
    }

    get fanDirection() {
        return this._fanDirection;
    }

    set fanDirection(value) {
        this._fanDirection = value;
    }
}
