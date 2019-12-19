import { MeasurementRaw } from "../models/MeasurementRaw";
import { ILuftdatenService } from "../interfaces/ILuftdatenService";

type Fetch = (url: RequestInfo, init?: RequestInit) => Promise<Response>;

export class LuftdatenService implements ILuftdatenService {

  private _fetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>;

  constructor(fetch: Fetch) {
    this._fetch = fetch;
  }

  /**
   * Get raw measurements from the last 5 minutes
   *
   * @returns {Promise<MeasurementRaw[]>}
   * @memberof LuftdatenService
   */
  public async getLatestMeasurements(): Promise<MeasurementRaw[]> {
    const response = await this._fetch("https://data.sensor.community/static/v1/data.json");
    const measurements: MeasurementRaw[] = await response.json();;
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
