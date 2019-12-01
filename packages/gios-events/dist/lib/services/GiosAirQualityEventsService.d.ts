/// <reference types="node" />
import { EventEmitter } from "events";
import { MeasurementStation } from "../models/MeasurementStation";
import { MeasurementStationSensor } from "../models/MeasurementStationSensor";
import { GiosAirQualityService } from "@kuuki/gios";
import { SensorDataRaw } from "@kuuki/gios/dist/lib/models/SensorDataRaw";
export declare interface GiosAirQualityEventsService {
    on(event: "station_joined", listener: (station: MeasurementStation) => void): this;
    on(event: "station_left", listener: (id: number) => void): this;
    on(event: "station_refreshed", listener: () => void): this;
    on(event: "sensor_joined", listener: (sensor: MeasurementStationSensor, station: MeasurementStation) => void): this;
    on(event: "sensor_left", listener: (sensorId: number, station: MeasurementStation) => void): this;
    on(event: "sensor_data" | "sensor_data_error", listener: (station: MeasurementStation, sensor: MeasurementStationSensor, sensorDataRaw: SensorDataRaw) => void): this;
    addListener(event: "station_joined", listener: (station: MeasurementStation) => void): this;
    addListener(event: "station_left", listener: (id: number) => void): this;
    addListener(event: "station_refreshed", listener: () => void): this;
    addListener(event: "sensor_joined", listener: (sensor: MeasurementStationSensor, station: MeasurementStation) => void): this;
    addListener(event: "sensor_left", listener: (sensorId: number, station: MeasurementStation) => void): this;
    addListener(event: "sensor_data" | "sensor_data_error", listener: (station: MeasurementStation, sensor: MeasurementStationSensor, measurement: SensorDataRaw) => void): this;
}
export declare class GiosAirQualityEventsService extends EventEmitter {
    private api;
    private refreshOptions;
    private _stations;
    constructor(api: GiosAirQualityService, refreshOptions: {
        stations: string;
        sensors: string;
        measurements: string;
    });
    initialize(): Promise<void>;
    getStations(): MeasurementStation[];
    getSensors(): MeasurementStationSensor[][];
    refreshStations(): Promise<void>;
    refreshSensors(): Promise<void>;
    refreshMeasurements(): Promise<void>;
    private assignSchedules;
}
