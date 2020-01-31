/// <reference types="node" />
import { EventEmitter } from "events";
import { GiosAirQualityService } from "@kuuki/gios";
import { SensorDataRaw } from "@kuuki/gios/dist/lib/models/SensorDataRaw";
import { RefreshOptions } from "../models/RefreshOptions";
import { StationRepository } from "../repositories/StationRepository";
import { SensorRepository } from "../repositories/SensorRepository";
import { MeasurementRepository } from "../repositories/MeasurementRepository";
import { MeasurementStationSensorRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationSensorRaw";
import { MeasurementStationRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationRaw";
import { Measurement } from "../models/Measurement";
export declare interface GiosAirQualityEventsService {
    on(event: "station_joined", listener: (station: MeasurementStationRaw) => void): this;
    on(event: "station_left", listener: (id: number) => void): this;
    on(event: "sensor_joined", listener: (sensor: MeasurementStationSensorRaw, station: MeasurementStationRaw) => void): this;
    on(event: "sensor_left", listener: (sensorId: number, station: MeasurementStationRaw) => void): this;
    on(event: "stations_refreshed" | "sensors_refreshed" | "data_refreshed", listener: () => void): this;
    on(event: "data", listener: (station: MeasurementStationRaw, sensor: MeasurementStationSensorRaw, sensorDataRaw: SensorDataRaw) => void): this;
    on(event: "measurement" | "measurement_update", listener: (stationId: number, sensor: MeasurementStationSensorRaw, measurement: Measurement) => void): this;
    addListener(event: "station_joined", listener: (station: MeasurementStationRaw) => void): this;
    addListener(event: "station_left", listener: (id: number) => void): this;
    addListener(event: "sensor_joined", listener: (sensor: MeasurementStationSensorRaw, station: MeasurementStationRaw) => void): this;
    addListener(event: "sensor_left", listener: (sensorId: number, station: MeasurementStationRaw) => void): this;
    addListener(event: "stations_refreshed" | "sensors_refreshed" | "data_refreshed", listener: () => void): this;
    addListener(event: "data", listener: (station: MeasurementStationRaw, sensor: MeasurementStationSensorRaw, sensorDataRaw: SensorDataRaw) => void): this;
    addListener(event: "measurement" | "measurement_update", listener: (stationId: number, sensor: MeasurementStationSensorRaw, measurement: Measurement) => void): this;
    emit(event: "station_joined", station: MeasurementStationRaw): boolean;
    emit(event: "station_left", id: number): boolean;
    emit(event: "sensor_joined", sensor: MeasurementStationSensorRaw, station: MeasurementStationRaw): boolean;
    emit(event: "sensor_left", sensorId: number, station: MeasurementStationRaw): boolean;
    emit(event: "stations_refreshed" | "sensors_refreshed" | "data_refreshed"): boolean;
    emit(event: "data", station: MeasurementStationRaw, sensor: MeasurementStationSensorRaw, sensorDataRaw: SensorDataRaw): boolean;
    emit(event: "measurement" | "measurement_update", stationId: number, sensor: MeasurementStationSensorRaw, measurement: Measurement): boolean;
}
export declare class GiosAirQualityEventsService extends EventEmitter {
    private api;
    private refreshOptions;
    private _stationRepository;
    private _sensorRepository;
    private _measurementRepository;
    constructor(api: GiosAirQualityService, refreshOptions: RefreshOptions, _stationRepository?: StationRepository, _sensorRepository?: SensorRepository, _measurementRepository?: MeasurementRepository);
    initialize(): Promise<void>;
    getStations(): Promise<MeasurementStationRaw[]>;
    findStation(id: number): Promise<MeasurementStationRaw[]>;
    getSensors(): Promise<MeasurementStationSensorRaw[]>;
    refreshStations(): Promise<void>;
    refreshSensors(): Promise<void>;
    refreshMeasurements(): Promise<void>;
    private assignSchedules;
}
