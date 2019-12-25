import { MeasurementRaw } from "../models/MeasurementRaw";
export interface ILuftdatenService {
    getLatestMeasurements(): Promise<MeasurementRaw[]>;
    getLatestMeasurementsBySensorType(sensorType: string | string[]): Promise<MeasurementRaw[]>;
    getLatestMeasurementsByBox(lat1: number, lon1: number, lat2: number, lon2: number): Promise<MeasurementRaw[]>;
    getLatestMeasurementsByArea(lat: number, lon: number, dist: number): Promise<MeasurementRaw[]>;
    getLatestMeasurementsByCountry(country: string): Promise<MeasurementRaw[]>;
    getAverageLatestMeasurements(): Promise<MeasurementRaw[]>;
    getAverageLastHourMeasurements(): Promise<MeasurementRaw[]>;
    getAverageLastDayMeasurements(): Promise<MeasurementRaw[]>;
}
