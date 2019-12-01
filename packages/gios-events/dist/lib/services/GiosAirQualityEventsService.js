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
const MeasurementStationSensor_1 = require("../models/MeasurementStationSensor");
const node_cron_1 = require("node-cron");
class GiosAirQualityEventsService extends events_1.EventEmitter {
    constructor(api, refreshOptions) {
        super();
        this.api = api;
        this.refreshOptions = refreshOptions;
        this.on("station_left", (id) => {
            // remove the station from the store, as further polls will fail
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
                .map(s => new MeasurementStationSensor_1.MeasurementStationSensor(s));
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
            (_d = (_c = station) === null || _c === void 0 ? void 0 : _c.sensors) === null || _d === void 0 ? void 0 : _d.push(sensor);
        }));
        this.on("sensor_data_error", (station, sensor, sensorDataRaw) => __awaiter(this, void 0, void 0, function* () {
            console.log(`[Defective sensor]: ${sensor.identifier.id} at station ${station.identifier.id}`);
        }));
        this.on("sensor_data", (station, sensor, sensorDataRaw) => __awaiter(this, void 0, void 0, function* () {
            // console.log(sensorDataRaw.values[0]);
        }));
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            // retrieve a list of stations
            const stationsRaw = yield this.api.getStations();
            this._stations = stationsRaw.map(station => new MeasurementStation_1.MeasurementStation(station));
            console.log(`[Server] Fetched all stations (${this._stations.length})`);
            // assign sensors to the station
            let sensors = 0;
            const sensorAssignmentPromises = this._stations.map((station) => __awaiter(this, void 0, void 0, function* () {
                const sensorsRaw = yield this.api.getSensors(station.identifier.id);
                sensors += sensorsRaw.length;
                station.sensors = sensorsRaw.map(sensor => new MeasurementStationSensor_1.MeasurementStationSensor(sensor));
                return Promise.resolve();
            }));
            yield Promise.all(sensorAssignmentPromises);
            console.log(`[Server] Fetched all sensors (${sensors})`);
            // let measurementsCount = 0;
            // const measurementPromises = this._stations.map(async (station) => {
            //   const measurements = station.sensors.map(async (sensor) => {
            //     sensor.latestMeasurement = await this.api.getMeasurements(sensor.identifier.id);
            //     measurementsCount += 60;
            //     return Promise.resolve();
            //   });
            //   return await Promise.all(measurements);
            // })
            // await Promise.all(measurementPromises);
            // console.log(`Fetched all sensor measurements (${measurementsCount})`);
            console.log('[Server] Synced up...');
            this.assignSchedules();
            return Promise.resolve();
        });
    }
    getStations() {
        return this._stations;
    }
    getSensors() {
        return this._stations.map(station => station.sensors);
    }
    refreshStations() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const refreshedStations = yield this.api.getStations();
            const prevIds = this._stations.map(station => station.identifier.id);
            const newIds = refreshedStations.map(station => station.id).map(Number);
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
            this.emit("station_refreshed");
            return Promise.resolve();
        });
    }
    refreshSensors() {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = this._stations.map((station) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const refreshedSensors = yield this.api.getSensors(station.identifier.id);
                const prevIds = station.sensors.map(sensor => sensor.identifier.id).map(Number);
                const newIds = refreshedSensors.map(sensor => sensor.id).map(Number);
                const missingIds = prevIds.filter(id => !newIds.includes(id));
                if (((_a = missingIds) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    missingIds.forEach(id => {
                        this.emit("sensor_left", id, station);
                    });
                }
                const addedIds = newIds.filter(id => !prevIds.includes(id));
                if (((_b = addedIds) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    addedIds.forEach(id => {
                        const sensor = new MeasurementStationSensor_1.MeasurementStationSensor(refreshedSensors.find(s => s.id === id));
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
                    var _a;
                    try {
                        const sensorDataRaw = yield this.api.getMeasurements(sensor.identifier.id);
                        sensor.latestMeasurement = sensorDataRaw;
                        if (((_a = sensorDataRaw) === null || _a === void 0 ? void 0 : _a.values.length) === 0) { // it's served but empty
                            this.emit("sensor_data_error", station, sensor, sensorDataRaw);
                            return Promise.resolve(true);
                        }
                        this.emit("sensor_data", station, sensor, sensorDataRaw);
                        const measurement = {
                            key: sensorDataRaw.key,
                            date: sensorDataRaw.values[0].date,
                            value: sensorDataRaw.values[0].value
                        };
                        this.emit("measurement", station, sensor, measurement);
                    }
                    catch (error) {
                        console.log("failed to refresh measurement on ", sensor.identifier.id);
                        return Promise.reject(error);
                    }
                    return Promise.resolve();
                }));
                yield Promise.all(p);
                return Promise.resolve();
            }));
            yield Promise.all(promises);
            return Promise.resolve();
        });
    }
    assignSchedules() {
        node_cron_1.schedule(this.refreshOptions.stations, () => __awaiter(this, void 0, void 0, function* () {
            console.log("Refreshing stations... ");
            try {
                yield this.refreshStations();
            }
            catch (error) {
                console.error("Refreshing stations failed.");
                throw error;
            }
            finally {
                // TODO: run sensors schedule if it was not set manually
            }
        }));
        node_cron_1.schedule(this.refreshOptions.sensors, () => __awaiter(this, void 0, void 0, function* () {
            console.log("Refreshing sensors...");
            try {
                yield this.refreshSensors();
            }
            catch (error) {
                console.error("Refreshing sensors failed.");
                throw error;
            }
        }));
        node_cron_1.schedule(this.refreshOptions.measurements, () => __awaiter(this, void 0, void 0, function* () {
            console.log("[Started] Getting measurements...");
            try {
                yield this.refreshMeasurements();
            }
            catch (error) {
                console.error("Refreshing measurements failed.");
                throw error;
            }
            finally {
                console.log("[Finished] Getting measurements");
            }
        }));
    }
}
exports.GiosAirQualityEventsService = GiosAirQualityEventsService;
