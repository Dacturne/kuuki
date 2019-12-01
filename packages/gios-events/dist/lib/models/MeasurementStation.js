"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class MeasurementStation extends events_1.EventEmitter {
    constructor(raw) {
        super();
        this.raw = raw;
        const id = {
            id: raw.id
        };
        this._identifier = id;
    }
    get identifier() {
        return this._identifier;
    }
}
exports.MeasurementStation = MeasurementStation;
