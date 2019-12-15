/// <reference types="node" />
import { EventEmitter } from "events";
import { MeasurementStation } from "../models/MeasurementStation";
import { Sensor } from "../models/Sensor";
import { GiosAirQualityService } from "@kuuki/gios";
import { SensorDataRaw } from "@kuuki/gios/dist/lib/models/SensorDataRaw";
import { Measurement } from "../models/Measurement";
import { RefreshOptions } from "../models/RefreshOptions";
export declare interface GiosAirQualityEventsService {
    on(event: "station_joined", listener: (station: MeasurementStation) => void): this;
    on(event: "station_left", listener: (id: number) => void): this;
    on(event: "sensor_joined", listener: (sensor: Sensor, station: MeasurementStation) => void): this;
    on(event: "sensor_left", listener: (sensorId: number, station: MeasurementStation) => void): this;
    on(event: "stations_refreshed" | "sensors_refreshed" | "data_refreshed", listener: () => void): this;
    on(event: "data", listener: (station: MeasurementStation, sensor: Sensor, sensorDataRaw: SensorDataRaw) => void): this;
    on(event: "measurement" | "measurement_update", listener: (stationId: number, sensor: Sensor, measurement: Measurement) => void): this;
    addListener(event: "station_joined", listener: (station: MeasurementStation) => void): this;
    addListener(event: "station_left", listener: (id: number) => void): this;
    addListener(event: "sensor_joined", listener: (sensor: Sensor, station: MeasurementStation) => void): this;
    addListener(event: "sensor_left", listener: (sensorId: number, station: MeasurementStation) => void): this;
    addListener(event: "stations_refreshed" | "sensors_refreshed" | "data_refreshed", listener: () => void): this;
    addListener(event: "data", listener: (station: MeasurementStation, sensor: Sensor, sensorDataRaw: SensorDataRaw) => void): this;
    addListener(event: "measurement" | "measurement_update", listener: (stationId: number, sensor: Sensor, measurement: Measurement) => void): this;
    emit(event: "station_joined", station: MeasurementStation): boolean;
    emit(event: "station_left", id: number): boolean;
    emit(event: "sensor_joined", sensor: Sensor, station: MeasurementStation): boolean;
    emit(event: "sensor_left", sensorId: number, station: MeasurementStation): boolean;
    emit(event: "stations_refreshed" | "sensors_refreshed" | "data_refreshed"): boolean;
    emit(event: "data", station: MeasurementStation, sensor: Sensor, sensorDataRaw: SensorDataRaw): boolean;
    emit(event: "measurement" | "measurement_update", stationId: number, sensor: Sensor, measurement: Measurement): boolean;
}
export declare class GiosAirQualityEventsService extends EventEmitter {
    private api;
    private refreshOptions;
    private _stations;
    constructor(api: GiosAirQualityService, refreshOptions: RefreshOptions);
    initialize(): Promise<void>;
    getStations(): MeasurementStation[];
    findStation(id: number): MeasurementStation;
    getSensors(): Sensor[];
    refreshStations(): Promise<void>;
    refreshSensors(): Promise<void>;
    refreshMeasurements(): Promise<void>;
    private assignSchedules;
    private attachListeners;
}
