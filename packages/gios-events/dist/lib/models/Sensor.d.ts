/// <reference types="node" />
import { EventEmitter } from "events";
import { MeasurementStationSensorRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationSensorRaw";
import { GiosAirQualityEventsService } from "../services/GiosAirQualityEventsService";
import { Measurement } from "./Measurement";
import { SensorDataRaw } from "@kuuki/gios/dist/lib/models/SensorDataRaw";
declare type SensorIdentifier = {
    id: number;
};
export declare interface Sensor {
    on(event: "update" | "measurement", listener: (measurement: Measurement) => void): this;
    addListener(event: "update" | "measurement", listener: (measurement: Measurement) => void): this;
    emit(event: "update" | "measurement", measurement: Measurement): boolean;
}
export declare class Sensor extends EventEmitter {
    private readonly _raw;
    private _eventsApi;
    readonly identifier: SensorIdentifier;
    readonly paramCode: string;
    protected measurements: Measurement[];
    private readonly _stationId;
    constructor(_raw: MeasurementStationSensorRaw, _eventsApi: GiosAirQualityEventsService);
    refreshData(raw: SensorDataRaw): void;
    getLatestMeasurement(): Measurement;
    private attachListeners;
}
export {};
