import { MeasurementRaw } from "../models/MeasurementRaw";

export interface ILuftdatenService {
  getLatestMeasurements(): Promise<MeasurementRaw[]>; // RAW Readings (last 5min)

  getLatestMeasurementsBySensorType(
    sensorType: string | string[]
  ): Promise<MeasurementRaw[]>; // RAW Readings (last 5min) but filtered by type

  getLatestMeasurementsByBox(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): Promise<MeasurementRaw[]>; // RAW Reading (last 5min) but filtered by box

  getLatestMeasurementsByArea(
    lat: number,
    lon: number,
    dist: number
  ): Promise<MeasurementRaw[]>; // RAW Reading (last 5min) but filtered by area

  // RAW Reading (last 5min) but filtered by country
  getLatestMeasurementsByCountry(country: string): Promise<MeasurementRaw[]>;

  getAverageLatestMeasurements(): Promise<MeasurementRaw[]>; // Average of last 5min (SERVICE TENDS TO BE DOWN)

  getAverageLastHourMeasurements(): Promise<MeasurementRaw[]>; // Average of last hour

  getAverageLastDayMeasurements(): Promise<MeasurementRaw[]>; // Average of last 24 hours
}
