/**
 * Represents the parameters for configuring an air conditioning (AC) system.
 *
 * @interface ACParamsType
 * @property {Boolean | null} power Indicates whether the AC system is powered on or off.
 * @property {String | Number | null} mode Specifies the operational mode of the AC system (e.g., cooling, heating, etc.).
 * @property {String | Number | null} specialMode Represents any special mode configured for the AC system.
 * @property {Boolean | Number | null} specialModeActive Indicates whether the special mode is currently active.
 * @property {Number | String | null} targetTemperature Specifies the desired temperature the AC system should maintain.
 * @property {Number | String | null} targetHumidity Specifies the desired humidity level the AC system should maintain.
 * @property {Number | null} fanRate Represents the speed or rate of the AC fan.
 * @property {Number | null} fanDirection Represents the direction of airflow from the AC system.
 */
interface ACParamsType {
    power: Boolean | null;
    mode: String | Number | null;
    specialMode: String | Number | null;
    specialModeActive: Boolean | Number | null;
    targetTemperature: Number | String | null;
    targetHumidity: Number | String | null;
    fanRate: Number | null;
    fanDirection: Number | null;
}

/**
 * Represents the parameters for an air conditioning (AC) system.
 * Provides getter and setter methods to manage the AC state and configuration.
 * Includes methods to convert the object's state into a plain object representation.
 */
export class ACParams implements ACParamsType {
    private _power: Boolean | null = null;
    private _mode: Number | String | null = null;
    private _specialMode: Number | String | null = null;
    private _specialModeActive: Boolean | Number | null = null;
    private _targetTemperature: Number | String | null = null;
    private _targetHumidity: Number | String | null = null;
    private _fanRate: Number | null = null;
    private _fanDirection: Number | null = null;

    constructor() {
    }

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
