import { MeasurementStationRaw } from "../models/MeasurementStationRaw";
import { MeasurementStationSensorRaw } from "../models/MeasurementStationSensorRaw";
import { SensorDataRaw } from "../models/SensorDataRaw";
export interface IPJPApi {
    getStations(): Promise<MeasurementStationRaw[]>;
    getSensors(stationId: number | string): Promise<MeasurementStationSensorRaw[]>;
    getMeasurements(sensorId: number | string): Promise<SensorDataRaw>;
}
