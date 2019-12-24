import { MeasurementRaw } from "../models/MeasurementRaw";
import { ILuftdatenService } from "../interfaces/ILuftdatenService";
import { IFetch } from "../interfaces/IFetch";
import { LuftdatenServiceConfig } from "../models/LuftdatenServiceConfig";
import fetch from "node-fetch";
import { ApiPaths } from "../models/ApiPaths";
import DEFAULTS from "../config";
import { GetLatestMeasurementsBySensorTypeCommand } from "../commands/GetLatestMeasurementsBySensorTypeCommand";
import { GetLatestMeasurementsByBoxCommand } from "../commands/GetLatestMeasurementsByBoxCommand";
import { GetLatestMeasurementsByAreaCommand } from "../commands/GetLatestMeasurementsByAreaCommand";
import { GetLatestMeasurementsByCountryCommand } from "../commands/GetLatestMeasurementsByCountryCommand";
import { GetMeasurementsCommand } from "../commands/GetMeasurementsCommand";

export class LuftdatenService implements ILuftdatenService {
  private _fetch: IFetch;
  private readonly _apiPaths: ApiPaths;

  constructor(config?: LuftdatenServiceConfig) {
    this._fetch = config?.fetch ?? (fetch as any);
    this._apiPaths = DEFAULTS.API_PATHS;
    if (config?.paths) {
      Object.keys(config.paths).forEach(path => {
        this._apiPaths[path] = config.paths[path];
      });
    }
  }

  /**
   * Get raw measurements from the last 5 minutes
   *
   * @returns {Promise<MeasurementRaw[]>}
   * @memberof LuftdatenService
   */
  public async getLatestMeasurements(): Promise<MeasurementRaw[]> {
    return new GetMeasurementsCommand(
      this._fetch,
      this._apiPaths.LATEST_MEASUREMENTS_PATH
    ).execute();
  }

  /**
   * Get raw measurements from the last 5 minutes
   * API Query is filtered by sensor type
   *
   * @returns {Promise<MeasurementRaw[]>}
   * @memberof LuftdatenService
   */
  public async getLatestMeasurementsBySensorType(
    sensorType: string | string[]
  ): Promise<MeasurementRaw[]> {
    return new GetLatestMeasurementsBySensorTypeCommand(
      this._fetch,
      sensorType,
      this._apiPaths.LATEST_MEASUREMENTS_FILTERED_PATH
    ).execute();
  }

  /**
   * Get raw measurements from the last 5 minutes
   * API Query is filtered by box
   *
   * @param {number} lat1
   * @param {number} lon1
   * @param {number} lat2
   * @param {number} lon2
   * @returns {Promise<MeasurementRaw[]>}
   * @memberof LuftdatenService
   */
  public async getLatestMeasurementsByBox(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): Promise<MeasurementRaw[]> {
    return new GetLatestMeasurementsByBoxCommand(
      this._fetch,
      this._apiPaths.LATEST_MEASUREMENTS_FILTERED_PATH,
      lat1,
      lon1,
      lat2,
      lon2
    ).execute();
  }

  /**
   * Get raw measurements from the last 5 minutes
   * API Query is filtered by area
   *
   * @param {number} lat
   * @param {number} lon
   * @param {number} dist
   * @returns {Promise<MeasurementRaw[]>}
   * @memberof LuftdatenService
   */
  public async getLatestMeasurementsByArea(
    lat: number,
    lon: number,
    dist: number
  ): Promise<MeasurementRaw[]> {
    return new GetLatestMeasurementsByAreaCommand(
      this._fetch,
      this._apiPaths.LATEST_MEASUREMENTS_FILTERED_PATH,
      lat,
      lon,
      dist
    ).execute();
  }

  /**
   * Get raw measurements from the last 5 minutes
   * API Query is filtered by country
   *
   * @param {string} country
   * @returns {Promise<MeasurementRaw[]>}
   * @memberof LuftdatenService
   */
  public async getLatestMeasurementsByCountry(country: string): Promise<MeasurementRaw[]> {
    return new GetLatestMeasurementsByCountryCommand(
      this._fetch,
      this._apiPaths.LATEST_MEASUREMENTS_FILTERED_PATH,
      country
    ).execute();
  }

  /**
   * Get averaged out measurements from the last 5 minutes
   *
   * @returns {Promise<MeasurementRaw[]>}
   * @memberof LuftdatenService
   */
  public getAverageLatestMeasurements(): Promise<MeasurementRaw[]> {
    return new GetMeasurementsCommand(
      this._fetch,
      this._apiPaths.AVERAGE_LATEST_MEASUREMENTS_PATH
    ).execute();
  }

  /**
   * Get averaged out measurements from the last hour
   *
   * @returns {Promise<MeasurementRaw[]>}
   * @memberof LuftdatenService
   */
  public getAverageLastHourMeasurements(): Promise<MeasurementRaw[]> {
    return new GetMeasurementsCommand(
      this._fetch,
      this._apiPaths.AVERAGE_LAST_HOUR_MEASUREMENTS_PATH
    ).execute();
  }

  /**
   * Get averaged out measurements from the last 24 hours
   *
   * @returns {Promise<MeasurementRaw[]>}
   * @memberof LuftdatenService
   */
  public getAverageLastDayMeasurements(): Promise<MeasurementRaw[]> {
    return new GetMeasurementsCommand(
      this._fetch,
      this._apiPaths.AVERAGE_LAST_DAY_MEASUREMENTS_PATH
    ).execute();
  }
}
