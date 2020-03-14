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
const events_1 = require("events");
const node_cron_1 = require("node-cron");
const utils_1 = require("../utils");
const StationRepository_1 = require("../repositories/StationRepository");
const SensorRepository_1 = require("../repositories/SensorRepository");
const MeasurementRepository_1 = require("../repositories/MeasurementRepository");
const levelup_1 = __importDefault(require("levelup"));
const leveldown_1 = __importDefault(require("leveldown"));
const level_ttl_1 = __importDefault(require("level-ttl"));
class GiosAirQualityEventsService extends events_1.EventEmitter {
    constructor(api, refreshOptions, _stationRepository = new StationRepository_1.StationRepository(level_ttl_1.default(levelup_1.default(leveldown_1.default("./db/stations")))), _sensorRepository = new SensorRepository_1.SensorRepository(level_ttl_1.default(levelup_1.default(leveldown_1.default("./db/sensors")))), _measurementRepository = new MeasurementRepository_1.MeasurementRepository(level_ttl_1.default(levelup_1.default(leveldown_1.default("./db/measurements"))))) {
        super();
        this.api = api;
        this.refreshOptions = refreshOptions;
        this._stationRepository = _stationRepository;
        this._sensorRepository = _sensorRepository;
        this._measurementRepository = _measurementRepository;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.assignSchedules();
            return Promise.resolve();
        });
    }
    getStations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._stationRepository.getAll();
        });
    }
    findStation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const stations = yield this._stationRepository.find({ identifier: id });
            return stations;
        });
    }
    getSensors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._sensorRepository.getAll();
        });
    }
    refreshStations() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let refreshedStations;
            try {
                refreshedStations = yield this.api.getStations();
            }
            catch (error) {
                refreshedStations = [];
            }
            for (const station of refreshedStations) {
                if (!(yield this._stationRepository.exists({ identifier: station.id }))) {
                    yield this._stationRepository.create({ identifier: station.id }, station);
                    this.emit("station_joined", station);
                }
            }
            const prevIds = yield ((_a = (yield this._stationRepository.getAll())) === null || _a === void 0 ? void 0 : _a.map(station => station.id));
            const newIds = yield (refreshedStations === null || refreshedStations === void 0 ? void 0 : refreshedStations.map(station => station.id));
            const missingIds = prevIds === null || prevIds === void 0 ? void 0 : prevIds.filter(id => !newIds.includes(id));
            if ((missingIds === null || missingIds === void 0 ? void 0 : missingIds.length) > 0) {
                missingIds.forEach(id => this.emit("station_left", id));
            }
            this.emit("stations_refreshed");
            return Promise.resolve();
        });
    }
    refreshSensors() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const stations = yield this._stationRepository.getAll();
            for (const station of stations) {
                let refreshedSensors;
                try {
                    refreshedSensors = yield this.api.getSensors(station.id);
                }
                catch (err) {
                    refreshedSensors = [];
                }
                const prevIds = (_a = (yield this.getSensors())) === null || _a === void 0 ? void 0 : _a.map(sensor => sensor.id);
                const newIds = refreshedSensors === null || refreshedSensors === void 0 ? void 0 : refreshedSensors.map(sensor => sensor.id);
                const missingIds = prevIds === null || prevIds === void 0 ? void 0 : prevIds.filter(id => !newIds.includes(id));
                if ((missingIds === null || missingIds === void 0 ? void 0 : missingIds.length) > 0) {
                    missingIds.forEach(id => {
                        this.emit("sensor_left", id, station);
                    });
                }
                const addedIds = newIds === null || newIds === void 0 ? void 0 : newIds.filter(id => !prevIds.includes(id));
                if ((addedIds === null || addedIds === void 0 ? void 0 : addedIds.length) > 0) {
                    addedIds.forEach(id => {
                        const sensor = refreshedSensors === null || refreshedSensors === void 0 ? void 0 : refreshedSensors.find(s => s.id === id);
                        this._sensorRepository.create({ identifier: sensor.id }, sensor);
                        this.emit("sensor_joined", sensor, station);
                    });
                }
            }
            return Promise.resolve();
        });
    }
    refreshMeasurements() {
        return __awaiter(this, void 0, void 0, function* () {
            const sensors = yield this._sensorRepository.getAll();
            for (const sensor of sensors) {
                // Grab fresh data
                let sensorDataRaw;
                try {
                    sensorDataRaw = yield this.api.getMeasurements(sensor.id);
                }
                catch (error) {
                    sensorDataRaw = null;
                }
                if (sensorDataRaw) {
                    for (const measurement of sensorDataRaw.values) {
                        const key = { sensorId: sensor.id, dateTime: measurement.date };
                        const exists = yield this._measurementRepository.exists(key);
                        if (exists === false) {
                            if (measurement.value != null) {
                                yield this._measurementRepository.create(key, measurement);
                                this.emit("measurement", sensor.stationId, sensor, measurement);
                            }
                        }
                        else {
                            // check if data changed
                            const latest = yield this._measurementRepository.find({
                                sensorId: sensor.id,
                                dateTime: measurement.date
                            });
                            // compare latest value with the freshly arrived one
                            if (latest[0].value !== measurement.value) {
                                // this._measurementRepository.update(key, measurement);
                                if (measurement.value != null) {
                                    this._measurementRepository.create(key, measurement);
                                    this.emit("measurement_update", sensor.stationId, sensor, measurement);
                                }
                            }
                        }
                    }
                }
            }
            this.emit("data_refreshed");
            return Promise.resolve();
        });
    }
    assignSchedules() {
        node_cron_1.schedule(this.refreshOptions.stations, () => __awaiter(this, void 0, void 0, function* () {
            console.log(`[Started] Refreshing stations... [${utils_1.getTime()}]`);
            try {
                yield this.refreshStations();
            }
            catch (error) {
                console.error("[Failed] Refreshing stations.");
                throw error;
            }
            finally {
                console.log(`[Finished] Refreshing stations. [${utils_1.getTime()}]`);
            }
        }));
        node_cron_1.schedule(this.refreshOptions.sensors, () => __awaiter(this, void 0, void 0, function* () {
            console.log(`[Started] Refreshing sensors... [${utils_1.getTime()}]`);
            try {
                yield this.refreshSensors();
            }
            catch (error) {
                console.error("[Failed] Refreshing sensors.");
                throw error;
            }
            finally {
                console.log(`[Finished] Refreshing sensors. [${utils_1.getTime()}]`);
            }
        }));
        node_cron_1.schedule(this.refreshOptions.measurements, () => __awaiter(this, void 0, void 0, function* () {
            console.log(`[Started] Getting measurements... [${utils_1.getTime()}]`);
            try {
                yield this.refreshMeasurements();
            }
            catch (error) {
                console.error("[Failed] Refreshing measurements.");
                throw error;
            }
            finally {
                console.log(`[Finished] Getting measurements... [${utils_1.getTime()}]`);
            }
        }));
    }
}
exports.GiosAirQualityEventsService = GiosAirQualityEventsService;
