import { MeasurementRaw } from "../models/MeasurementRaw";

export interface ILuftdatenService {
  // https://data.sensor.community/static/v1/data.json
  // or
  // https://data.sensor.community/airrohr/v1/filter/area={lat},{lon},{dist}
  // /type={sensor_type}
  // /box={lat1,lon1,lat2,lon2}
  // /country={country_code}
  getLatestMeasurements(): Promise<MeasurementRaw[]>; // RAW Readings (last 5min)

  // https://api.luftdaten.info/static/v2/data.json
  getAverageLatestMeasurements(): Promise<MeasurementRaw[]>; // Average of last 5min (SERVICE TENDS TO BE DOWN)

  // https://data.sensor.community/static/v2/data.1h.json
  getAverageLastHourMeasurements(): Promise<MeasurementRaw[]>; // Average of last hour

  // https://data.sensor.community/static/v2/data.24h.json
  getAverageLastDayMeasurements(): Promise<MeasurementRaw[]>; // Average of last 24 hours
}
