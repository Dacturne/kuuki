"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = __importDefault(require("../config"));
const GetLatestMeasurementsBySensorTypeCommand_1 = require("../commands/GetLatestMeasurementsBySensorTypeCommand");
const GetLatestMeasurementsByBoxCommand_1 = require("../commands/GetLatestMeasurementsByBoxCommand");
const GetLatestMeasurementsByAreaCommand_1 = require("../commands/GetLatestMeasurementsByAreaCommand");
const GetLatestMeasurementsByCountryCommand_1 = require("../commands/GetLatestMeasurementsByCountryCommand");
const GetMeasurementsCommand_1 = require("../commands/GetMeasurementsCommand");
class LuftdatenService {
    constructor(config) {
        var _a;
        this._fetch = (_a = config === null || config === void 0 ? void 0 : config.fetch) !== null && _a !== void 0 ? _a : node_fetch_1.default;
        this._apiPaths = config_1.default.API_PATHS;
        if (config === null || config === void 0 ? void 0 : config.paths) {
            Object.keys(config.paths).forEach(path => {
                this._apiPaths[path] = config.paths[path];
            });
        }
    }
    /**
     * Get raw measurements from the last 5 minutes
     *
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getLatestMeasurements() {
        return __awaiter(this, void 0, void 0, function* () {
            return new GetMeasurementsCommand_1.GetMeasurementsCommand(this._fetch, this._apiPaths.LATEST_MEASUREMENTS_PATH).execute();
        });
    }
    /**
     * Get raw measurements from the last 5 minutes
     * API Query is filtered by sensor type
     *
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getLatestMeasurementsBySensorType(sensorType) {
        return __awaiter(this, void 0, void 0, function* () {
            return new GetLatestMeasurementsBySensorTypeCommand_1.GetLatestMeasurementsBySensorTypeCommand(this._fetch, sensorType, this._apiPaths.LATEST_MEASUREMENTS_FILTERED_PATH).execute();
        });
    }
    /**
     * Get raw measurements from the last 5 minutes
     * API Query is filtered by box
     *
     * @param {number} lat1
     * @param {number} lon1
     * @param {number} lat2
     * @param {number} lon2
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getLatestMeasurementsByBox(lat1, lon1, lat2, lon2) {
        return __awaiter(this, void 0, void 0, function* () {
            return new GetLatestMeasurementsByBoxCommand_1.GetLatestMeasurementsByBoxCommand(this._fetch, this._apiPaths.LATEST_MEASUREMENTS_FILTERED_PATH, lat1, lon1, lat2, lon2).execute();
        });
    }
    /**
     * Get raw measurements from the last 5 minutes
     * API Query is filtered by area
     *
     * @param {number} lat
     * @param {number} lon
     * @param {number} dist
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getLatestMeasurementsByArea(lat, lon, dist) {
        return __awaiter(this, void 0, void 0, function* () {
            return new GetLatestMeasurementsByAreaCommand_1.GetLatestMeasurementsByAreaCommand(this._fetch, this._apiPaths.LATEST_MEASUREMENTS_FILTERED_PATH, lat, lon, dist).execute();
        });
    }
    /**
     * Get raw measurements from the last 5 minutes
     * API Query is filtered by country
     *
     * @param {string} country
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getLatestMeasurementsByCountry(country) {
        return __awaiter(this, void 0, void 0, function* () {
            return new GetLatestMeasurementsByCountryCommand_1.GetLatestMeasurementsByCountryCommand(this._fetch, this._apiPaths.LATEST_MEASUREMENTS_FILTERED_PATH, country).execute();
        });
    }
    /**
     * Get averaged out measurements from the last 5 minutes
     *
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getAverageLatestMeasurements() {
        return new GetMeasurementsCommand_1.GetMeasurementsCommand(this._fetch, this._apiPaths.AVERAGE_LATEST_MEASUREMENTS_PATH).execute();
    }
    /**
     * Get averaged out measurements from the last hour
     *
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getAverageLastHourMeasurements() {
        return new GetMeasurementsCommand_1.GetMeasurementsCommand(this._fetch, this._apiPaths.AVERAGE_LAST_HOUR_MEASUREMENTS_PATH).execute();
    }
    /**
     * Get averaged out measurements from the last 24 hours
     *
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getAverageLastDayMeasurements() {
        return new GetMeasurementsCommand_1.GetMeasurementsCommand(this._fetch, this._apiPaths.AVERAGE_LAST_DAY_MEASUREMENTS_PATH).execute();
    }
}
exports.LuftdatenService = LuftdatenService;
//# sourceMappingURL=LuftdatenService.js.map