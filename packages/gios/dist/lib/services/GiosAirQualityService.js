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
const fetch_retry_1 = __importDefault(require("fetch-retry"));
const config_1 = __importDefault(require("../config"));
const utils_1 = require("../utils");
const defaultFetcher = (url) => {
    return fetch_retry_1.default(node_fetch_1.default)(url, {
        retries: 5,
        retryDelay: 1000,
    });
};
class GiosAirQualityService {
    constructor(config) {
        this.bootstrapEndpoints(config);
    }
    getStations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield defaultFetcher(`${this.domain}/${config_1.default.BASE_PATH}/${this.paths.allStationsPath}`);
                if (response.status !== 200) {
                    return Promise.reject("GIOS_FAILURE");
                }
                const stations = yield response.json();
                return stations;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    getSensors(stationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield defaultFetcher(`${this.domain}/${this.paths.basePath}/${this.paths.sensorsPath}/${stationId}`);
                if (response.status !== 200) {
                    return Promise.reject("GIOS_FAILURE");
                }
                const sensors = yield response.json();
                return sensors;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    getMeasurements(sensorId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield defaultFetcher(`${this.domain}/${this.paths.basePath}/${this.paths.sensorDataPath}/${sensorId}`);
                if (response.status !== 200) {
                    return Promise.reject("GIOS_FAILURE");
                }
                const data = yield response.json();
                return data;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    bootstrapEndpoints(config) {
        if (config === null || config === void 0 ? void 0 : config.domain) {
            if (utils_1.isTrailingSlash(config.domain)) {
                // remove trailing slashes
                this.domain = config.domain.slice(0, -1);
            }
            else {
                this.domain = config.domain;
            }
        }
        else {
            this.domain = config_1.default.DOMAIN;
        }
        // Load defaults to satisfy Required<T>
        this.paths = {
            basePath: config_1.default.BASE_PATH,
            allStationsPath: config_1.default.ALL_STATIONS_PATH,
            sensorsPath: config_1.default.SENSORS_PATH,
            sensorDataPath: config_1.default.SENSOR_DATA_PATH,
        };
        // Override defaults
        if (config === null || config === void 0 ? void 0 : config.paths) {
            Object.keys(config.paths).forEach(path => {
                this.paths[path] = config.paths[path];
            });
        }
    }
}
exports.GiosAirQualityService = GiosAirQualityService;
