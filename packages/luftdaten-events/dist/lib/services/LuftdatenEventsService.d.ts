/// <reference types="node" />
import { LuftdatenService } from "@kuuki/luftdaten";
import { RefreshOptions } from "../models/RefreshOptions";
import { EventEmitter } from "events";
import { MeasurementRepository } from "../repositories/MeasurementRepository";
export declare class LuftdatenEventsService extends EventEmitter {
    private _api;
    private _repo;
    private refreshOptions?;
    constructor(_api: LuftdatenService, _repo: MeasurementRepository, refreshOptions?: RefreshOptions);
    track(opts: RefreshOptions): Promise<void>;
    private _checkMeasurementExistance;
    private _createMeasurement;
    private _getLatestMeasurementsHandler;
    private _measurementExistsHandler;
}
export declare function getTime(): string;
