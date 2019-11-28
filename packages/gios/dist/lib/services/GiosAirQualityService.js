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
const utils_1 = require("../utils");
class GiosAirQualityService {
    constructor(config) {
        this.bootstrapEndpoints(config);
    }
    getStations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield node_fetch_1.default(`${this.domain}/${config_1.default.BASE_PATH}/${this.paths.allStationsPath}`);
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
                const response = yield node_fetch_1.default(`${this.domain}/${this.paths.sensorsPath}/${stationId}`);
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
                const response = yield node_fetch_1.default(`${this.domain}/${this.paths.sensorDataPath}/${sensorId}`);
                const data = yield response.json();
                return data;
            }
            catch (error) {
                return Promise.reject(error);
            }
        });
    }
    bootstrapEndpoints(config) {
        var _a, _b;
        if ((_a = config) === null || _a === void 0 ? void 0 : _a.domain) {
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
        if ((_b = config) === null || _b === void 0 ? void 0 : _b.paths) {
            Object.keys(config.paths).forEach(path => {
                this.paths[path] = config.paths[path];
            });
        }
    }
}
exports.GiosAirQualityService = GiosAirQualityService;
