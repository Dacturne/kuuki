/// <reference types="node" />
import { MeasurementStationRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationRaw";
import { EventEmitter } from "events";
import { MeasurementStationSensor } from "./MeasurementStationSensor";
export declare type MeasurementStationIdentifier = {
    id: number;
};
export declare interface MeasurementStation {
    on(event: "update", listener: Function): this;
    on(event: "error", listener: Function): this;
}
export declare class MeasurementStation extends EventEmitter {
    protected readonly raw: MeasurementStationRaw;
    private readonly _identifier;
    sensors: MeasurementStationSensor[];
    get identifier(): MeasurementStationIdentifier;
    constructor(raw: MeasurementStationRaw);
}
