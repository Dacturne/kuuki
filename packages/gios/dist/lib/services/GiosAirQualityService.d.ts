import { IPJPApi } from "../interfaces/IPJPApi";
import { MeasurementStationRaw } from "../models/MeasurementStationRaw";
import { ApiPaths } from "../models/ApiPaths";
import { MeasurementStationSensorRaw } from "../models/MeasurementStationSensorRaw";
import { SensorDataRaw } from "../models/SensorDataRaw";
import { PJPApiConfig } from "../models/PJPApiConfig";
export declare class GiosAirQualityService implements IPJPApi {
    protected domain: string;
    protected paths: Required<ApiPaths>;
    constructor(config?: PJPApiConfig);
    getStations(): Promise<MeasurementStationRaw[]>;
    getSensors(stationId: number | string): Promise<MeasurementStationSensorRaw[]>;
    getMeasurements(sensorId: number | string): Promise<SensorDataRaw>;
    protected bootstrapEndpoints(config: PJPApiConfig): void;
}
