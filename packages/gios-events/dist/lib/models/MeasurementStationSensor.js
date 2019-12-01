"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class MeasurementStationSensor extends events_1.EventEmitter {
    constructor(_raw, _eventsApi) {
        super();
        this._raw = _raw;
        this._eventsApi = _eventsApi;
        this.identifier = {
            id: _raw.id
        };
    }
    set latestMeasurement(measurement) {
        this._latestMeasurement = measurement;
        this.emit("update");
    }
    subscribe() {
        console.log(this.identifier.id, ' sends request for subscription...');
        // this?._eventsApi.subscribe(this);
    }
}
exports.MeasurementStationSensor = MeasurementStationSensor;
