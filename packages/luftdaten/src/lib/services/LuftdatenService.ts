import { MeasurementRaw } from "../models/MeasurementRaw";
import { ILuftdatenService } from "../interfaces/ILuftdatenService";
import { Fetch } from "../models/Fetch";
import { LuftdatenServiceConfig } from "../models/LuftdatenServiceConfig";
import fetch from "node-fetch";
import { ApiPaths } from "../models/ApiPaths";
import DEFAULTS from "../config";

export class LuftdatenService implements ILuftdatenService {

  private _fetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>;
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
    const response = await this._fetch(this._apiPaths.LATEST_MEASUREMENTS_PATH);
    const measurements: MeasurementRaw[] = await response.json();
    return measurements;
  }

  /**
   * Get raw measurements from the last 5 minutes
   * API Query is filtered by sensor type
   *
   * @returns {Promise<MeasurementRaw[]>}
   * @memberof LuftdatenService
   */
  public async getLatestMeasurementsBySensorType(sensorType: string|string[]): Promise<MeasurementRaw[]> {
    if (sensorType.length === 0) {
      return Promise.reject("Empty array passed to query")
    }
    const url = this._apiPaths.LATEST_MEASUREMENTS_FILTERED_PATH + "type=";
    let query: string;
    if (Array.isArray(sensorType)) {
      query = (sensorType as string[]).join(",")
    } else {
      query = sensorType;
    }
    const response = await this._fetch(url+query);
    const measurements: MeasurementRaw[] = await response.json();
    return measurements;
  }

  /**
   * Get averaged out measurements from the last 5 minutes
   *
   * @returns {Promise<MeasurementRaw[]>}
   * @memberof LuftdatenService
   */
  public getAverageLatestMeasurements(): Promise<MeasurementRaw[]> {
    throw new Error("Method not implemented.");
  }

  /**
   * Get averaged out measurements from the last hour
   *
   * @returns {Promise<MeasurementRaw[]>}
   * @memberof LuftdatenService
   */
  public getAverageLastHourMeasurements(): Promise<MeasurementRaw[]> {
    throw new Error("Method not implemented.");
  }

  /**
   * Get averaged out measurements from the last 24 hours
   *
   * @returns {Promise<MeasurementRaw[]>}
   * @memberof LuftdatenService
   */
  public getAverageLastDayMeasurements(): Promise<MeasurementRaw[]> {
    throw new Error("Method not implemented.");
  }
}
