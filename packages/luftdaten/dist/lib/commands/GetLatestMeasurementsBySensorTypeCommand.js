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
class GetLatestMeasurementsBySensorTypeCommand {
    constructor(_fetch, _sensorType, _path) {
        this._fetch = _fetch;
        this._sensorType = _sensorType;
        this._path = _path;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._sensorType.length === 0) {
                return Promise.reject("Empty array passed to query");
            }
            const url = this.buildUrl();
            const response = yield this._fetch(url);
            const measurements = yield response.json();
            return measurements;
        });
    }
    buildUrl() {
        const url = this._path + "type=";
        let query;
        if (Array.isArray(this._sensorType)) {
            query = this._sensorType.join(",");
        }
        else {
            query = this._sensorType;
        }
        return url + query;
    }
}
exports.GetLatestMeasurementsBySensorTypeCommand = GetLatestMeasurementsBySensorTypeCommand;
//# sourceMappingURL=GetLatestMeasurementsBySensorTypeCommand.js.map