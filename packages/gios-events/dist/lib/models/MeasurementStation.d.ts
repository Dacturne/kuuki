/// <reference types="node" />
import { MeasurementStationRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationRaw";
import { EventEmitter } from "events";
import { Sensor } from "./Sensor";
export declare type MeasurementStationIdentifier = {
    id: number;
};
export declare class MeasurementStation extends EventEmitter {
    protected readonly raw: MeasurementStationRaw;
    get identifier(): MeasurementStationIdentifier;
    sensors: Sensor[];
    private readonly _identifier;
    constructor(raw: MeasurementStationRaw);
}
