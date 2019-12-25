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
class GetLatestMeasurementsByBoxCommand {
    constructor(_fetch, _path, _lat1, _lon1, _lat2, _lon2) {
        this._fetch = _fetch;
        this._path = _path;
        this._lat1 = _lat1;
        this._lon1 = _lon1;
        this._lat2 = _lat2;
        this._lon2 = _lon2;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.buildUrl();
            const response = yield this._fetch(url);
            const measurements = yield response.json();
            return measurements;
        });
    }
    buildUrl() {
        const url = this._path + "box=";
        const query = [this._lat1, this._lon1, this._lat2, this._lon2].join(",");
        return url + query;
    }
}
exports.GetLatestMeasurementsByBoxCommand = GetLatestMeasurementsByBoxCommand;
//# sourceMappingURL=GetLatestMeasurementsByBoxCommand.js.map