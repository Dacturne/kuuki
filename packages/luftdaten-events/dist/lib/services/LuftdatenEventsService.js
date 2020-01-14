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
const node_cron_1 = require("node-cron");
class LuftdatenEventsService extends events_1.EventEmitter {
    constructor(_api, _repo, refreshOptions) {
        super();
        this._api = _api;
        this._repo = _repo;
        this.refreshOptions = refreshOptions;
    }
    track(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            // Track what we want
            Object.keys(opts).forEach((key) => __awaiter(this, void 0, void 0, function* () {
                console.log("Track: ", key);
                console.log("with crontab: ", opts[key].crontab);
                const args = Object.assign({}, opts[key]);
                delete args.crontab;
                console.log("and args:");
                console.log(args);
                // Ugly for now TODO: Think of a nicer way for invocation
                if (key === "getAverageLastHourMeasurements") {
                    throw new Error('Not implemented');
                    // await this._api.getAverageLastHourMeasurements();
                }
                if (key === "getAverageLatestMeasurements") {
                    throw new Error('Not implemented');
                    // await this._api.getAverageLatestMeasurements();
                }
                if (key === "getLatestMeasurements") {
                    console.log(`Scheduled [ getLatestMeasurements ] with [ ${opts[key].crontab} ]`);
                    node_cron_1.schedule(opts[key].crontab, this._getLatestMeasurementsHandler.bind(this));
                }
                if (key === "getLatestMeasurementsByArea") {
                    throw new Error('Not implemented');
                    // await this._api.getLatestMeasurementsByArea(args.lat, args.lon, args.dist);
                }
                if (key === "getLatestMeasurementsByBox") {
                    throw new Error('Not implemented');
                    // await this._api.getLatestMeasurementsByBox(args.lat1, args.lon1, args.lat2, args.lon2);
                }
                if (key === "getLatestMeasurementsByCountry") {
                    throw new Error('Not implemented');
                    // await this._api.getLatestMeasurementsByCountry(args.country);
                }
                if (key === "getLatestMeasurementsBySensorType") {
                    throw new Error('Not implemented');
                    // await this._api.getLatestMeasurementsBySensorType(args.sensorType);
                }
                return Promise.resolve();
            }));
        });
    }
    _checkMeasurementExistance(measurement) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, timestamp } = measurement;
            try {
                const exists = yield this._repo.exists({ id, timestamp });
                return Promise.resolve(exists);
            }
            catch (err) {
                return Promise.reject(err);
            }
        });
    }
    _createMeasurement(measurement) {
        const { id, timestamp } = measurement;
        try {
            return this._repo.create({ id, timestamp }, measurement);
        }
        catch (err) {
            Promise.reject(err);
        }
    }
    _getLatestMeasurementsHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`getLatestMeasurements cron fired [${getTime()}]`);
            const measurements = yield this._api.getLatestMeasurements();
            yield Promise.all(measurements.map((measurement) => __awaiter(this, void 0, void 0, function* () {
                const exists = yield this._checkMeasurementExistance(measurement);
                if (!exists) {
                    yield this._measurementExistsHandler(measurement);
                }
                return Promise.resolve();
            })));
        });
    }
    _measurementExistsHandler(measurement) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._createMeasurement(measurement);
                this.emit("measurement", {
                    source: "getLatestMeasurements",
                    data: measurement
                });
                Promise.resolve();
            }
            catch (err) {
                Promise.reject(err);
            }
        });
    }
}
exports.LuftdatenEventsService = LuftdatenEventsService;
function getTime() {
    return new Date().toISOString()
        .replace(/([0-9]){4}(-[0-9]{2}){2}/, '')
        .replace(/T/, '')
        .replace(/\..+/, '');
}
exports.getTime = getTime;
//# sourceMappingURL=LuftdatenEventsService.js.map