"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class Sensor extends events_1.EventEmitter {
    constructor(_raw, _eventsApi) {
        super();
        this._raw = _raw;
        this._eventsApi = _eventsApi;
        this.measurements = []; // should hold 62 records or none
        this.identifier = { id: _raw.id };
        this.paramCode = _raw.param.paramCode;
        this._stationId = _raw.stationId;
        this.attachListeners();
    }
    refreshData(raw) {
        // check if there are any changes to the data
        if (this.measurements.length === 0) { // fresh instance
            const measurements = raw.values.map(rd => {
                const measurement = {
                    date: rd.date,
                    value: rd.value
                };
                return measurement;
            });
            this.measurements = measurements;
            // do not emit anything, it's probably initialized or the app restarted
        }
        else { // something is already stored
            // compare values and emit events
            const latestDate = this.measurements[0].date;
            raw.values.forEach(({ date, value }) => {
                // compare values (we might have nulls)
                const index = this.measurements.findIndex((m, idx) => m.date === date);
                if (index >= 0) {
                    if (this.measurements[index].value != value) {
                        // trust the newer data (replace);
                        this.measurements[index].value = value;
                        this.emit("update", this.measurements[index]);
                    }
                }
                // it could be a new measurement
                if (date > latestDate) {
                    // add it to our list (at the start)
                    this.measurements.splice(0, 0, { date, value });
                    if (value != null) {
                        // emit measurement as it seems valid already
                        this.emit("measurement", { date, value });
                    }
                }
            });
            // remove oldest elements if there are more than 62 elements
            const count = this.measurements.length;
            if (count > 62) {
                for (let i = count - 62; i > 0; i--)
                    this.measurements.pop();
            }
        }
    }
    getLatestMeasurement() {
        return this.measurements[0];
    }
    attachListeners() {
        this.on("update", (measurement) => {
            this._eventsApi.emit("measurement_update", this._stationId, this, measurement);
        });
        this.on("measurement", (measurement) => {
            this._eventsApi.emit("measurement", this._stationId, this, measurement);
        });
    }
}
exports.Sensor = Sensor;
