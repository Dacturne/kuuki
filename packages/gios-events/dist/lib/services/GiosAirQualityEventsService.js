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
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const MeasurementStation_1 = require("../models/MeasurementStation");
const Sensor_1 = require("../models/Sensor");
const node_cron_1 = require("node-cron");
const utils_1 = require("../utils");
class GiosAirQualityEventsService extends events_1.EventEmitter {
    constructor(api, refreshOptions) {
        super();
        this.api = api;
        this.refreshOptions = refreshOptions;
        this.attachListeners();
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // retrieve a list of stations
            const stationsRaw = yield this.api.getStations();
            this._stations = stationsRaw.map(station => new MeasurementStation_1.MeasurementStation(station));
            console.log(`[Server] Fetched all stations (${this._stations.length}) [${utils_1.getTime()}]`);
            // assign sensors to the station
            let sensors = 0;
            const sensorAssignmentPromises = this._stations.map((station) => __awaiter(this, void 0, void 0, function* () {
                const sensorsRaw = yield this.api.getSensors(station.identifier.id);
                sensors += sensorsRaw.length;
                station.sensors = sensorsRaw.map(sensor => new Sensor_1.Sensor(sensor, this));
                return Promise.resolve();
            }));
            yield Promise.all(sensorAssignmentPromises);
            console.log(`[Server] Fetched all sensors (${sensors}) [${utils_1.getTime()}]`);
            // assign measurements to the sensors
            let measurementsCount = 0;
            const measurementPromises = this._stations.map((station) => __awaiter(this, void 0, void 0, function* () {
                const measurements = station.sensors.map((sensor) => __awaiter(this, void 0, void 0, function* () {
                    const rawSensorData = yield this.api.getMeasurements(sensor.identifier.id);
                    sensor.refreshData(rawSensorData);
                    measurementsCount += rawSensorData.values.length;
                    return Promise.resolve();
                }));
                return yield Promise.all(measurements);
            }));
            yield Promise.all(measurementPromises);
            console.log(`[Server] Fetched all sensor measurements (${measurementsCount})`);
            console.log(`[Server] Synced up... [${utils_1.getTime()}]`);
            this.assignSchedules();
            return Promise.resolve();
        });
    }
    getStations() {
        return this._stations;
    }
    findStation(id) {
        return this._stations.find((station, index) => {
            return station.identifier.id === id;
        });
    }
    getSensors() {
        const sensors = [];
        for (const station of this._stations) {
            sensors.push(...station.sensors);
        }
        return sensors;
    }
    refreshStations() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const refreshedStations = yield this.api.getStations();
            const prevIds = this._stations.map(station => station.identifier.id);
            const newIds = refreshedStations.map(station => station.id);
            const missingIds = prevIds.filter(id => !newIds.includes(id));
            if (((_a = missingIds) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                missingIds.forEach(id => this.emit("station_left", id));
            }
            const addedIds = newIds.filter(id => !prevIds.includes(id));
            if (((_b = addedIds) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                addedIds.forEach(id => {
                    const station = new MeasurementStation_1.MeasurementStation(refreshedStations.find(s => s.id === id));
                    this.emit("station_joined", station);
                });
            }
            this.emit("stations_refreshed");
            return Promise.resolve();
        });
    }
    refreshSensors() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = this._stations.map((station) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const refreshedSensors = yield this.api.getSensors(station.identifier.id);
                const prevIds = station.sensors.map(sensor => sensor.identifier.id);
                const newIds = refreshedSensors.map(sensor => sensor.id);
                const missingIds = prevIds.filter(id => !newIds.includes(id));
                if (((_a = missingIds) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    missingIds.forEach(id => {
                        this.emit("sensor_left", id, station);
                    });
                }
                const addedIds = newIds.filter(id => !prevIds.includes(id));
                if (((_b = addedIds) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    addedIds.forEach(id => {
                        const sensor = new Sensor_1.Sensor(refreshedSensors.find(s => s.id === id), this);
                        this.emit("sensor_joined", sensor, station);
                    });
                }
                return Promise.resolve();
            }));
            yield Promise.all(promises);
            return Promise.resolve();
        });
    }
    refreshMeasurements() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = this._stations.map((station) => __awaiter(this, void 0, void 0, function* () {
                const p = station.sensors.map((sensor) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const sensorDataRaw = yield this.api.getMeasurements(sensor.identifier.id);
                        this.emit("data", station, sensor, sensorDataRaw);
                        sensor.refreshData(sensorDataRaw);
                    }
                    catch (error) {
                        throw error;
                    }
                    return Promise.resolve();
                }));
                yield Promise.all(p);
                return Promise.resolve();
            }));
            yield Promise.all(promises);
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
    attachListeners() {
        this.on("station_left", (id) => {
            // remove the station from the store, as further polls will presumably fail
            console.log('listener is removing the station ', id);
            const station = this._stations.find(s => {
                return s.identifier.id === id;
            });
            console.log(this._stations.length);
            this._stations.splice(this._stations.indexOf(station), 1);
            console.log('removed...');
            console.log(this._stations.length);
        });
        this.on("station_joined", (station) => __awaiter(this, void 0, void 0, function* () {
            console.log('listener is adding the station with id', station.identifier.id);
            // fetch sensors for the station
            const sensors = (yield this.api.getSensors(station.identifier.id))
                .map(s => new Sensor_1.Sensor(s, this));
            station.sensors = sensors;
            this._stations.push(station);
        }));
        this.on("sensor_left", (id, station) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log(`Sensor: [${id}] is getting removed from station [${station.identifier.id}]`);
            (_b = (_a = station) === null || _a === void 0 ? void 0 : _a.sensors) === null || _b === void 0 ? void 0 : _b.splice(this._stations.indexOf(station), 1);
        }));
        this.on("sensor_joined", (sensor, station) => __awaiter(this, void 0, void 0, function* () {
            var _c, _d;
            console.log(`Sensor: [${sensor.identifier.id}] is getting added to station [${station.identifier.id}]`);
            // fetch measurements for the sensor
            const sensorRawData = yield this.api.getMeasurements(station.identifier.id);
            sensor.refreshData(sensorRawData);
            (_d = (_c = station) === null || _c === void 0 ? void 0 : _c.sensors) === null || _d === void 0 ? void 0 : _d.push(sensor);
        }));
    }
}
exports.GiosAirQualityEventsService = GiosAirQualityEventsService;
