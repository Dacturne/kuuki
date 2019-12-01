/// <reference types="node" />
import { EventEmitter } from "events";
import { SensorDataRaw } from "@kuuki/gios/dist/lib/models/SensorDataRaw";
import { MeasurementStationSensorRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationSensorRaw";
import { GiosAirQualityEventsService } from "../services/GiosAirQualityEventsService";
declare type MeasurementStationSensorIdentifier = {
    id: number | string;
};
export declare interface MeasurementStationSensor {
    on(event: "update", listener: Function): this;
    on(event: "error", listener: Function): this;
}
export declare class MeasurementStationSensor extends EventEmitter {
    protected _raw: MeasurementStationSensorRaw;
    private _eventsApi?;
    protected measurements: SensorDataRaw[];
    protected _latestMeasurement: SensorDataRaw;
    identifier: MeasurementStationSensorIdentifier;
    set latestMeasurement(measurement: SensorDataRaw);
    constructor(_raw: MeasurementStationSensorRaw, _eventsApi?: GiosAirQualityEventsService);
    subscribe(): void;
}
export {};
