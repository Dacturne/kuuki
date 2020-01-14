/// <reference types="node" />
import { LuftdatenService } from "@kuuki/luftdaten";
import { RefreshOptions } from "../models/RefreshOptions";
import { EventEmitter } from "events";
import { MeasurementRaw } from "@kuuki/luftdaten/dist/lib/models/MeasurementRaw";
import { MeasurementRepository } from "../repositories/MeasurementRepository";
export declare interface LuftdatenEventsService {
    on(event: "measurement", listener: (payload: {
        source: string;
        data: MeasurementRaw;
    }) => void): this;
    addListener(event: "measurement", listener: (payload: {
        source: string;
        data: MeasurementRaw;
    }) => void): this;
    emit(event: "measurement", payload: {
        source: string;
        data: MeasurementRaw;
    }): boolean;
}
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
