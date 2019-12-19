import { MeasurementRaw } from "../models/MeasurementRaw";
import { ILuftdatenService } from "../interfaces/ILuftdatenService";
import fetch, { RequestInfo, RequestInit, Response } from "node-fetch";

export class LuftdatenService implements ILuftdatenService {

  protected fetch: (url: RequestInfo, init?: RequestInit) => Promise<Response>;

  constructor() {
    this.fetch = fetch;
  }

  /**
   * Get raw measurements from the last 5 minutes
   *
   * @returns {MeasurementRaw[]}
   * @memberof LuftdatenService
   */
  public getLatestMeasurements(): MeasurementRaw[] {
    throw new Error("Method not implemented.");
  }

  /**
   * Get averaged out measurements from the last 5 minutes
   *
   * @returns {MeasurementRaw[]}
   * @memberof LuftdatenService
   */
  public getAverageLatestMeasurements(): MeasurementRaw[] {
    throw new Error("Method not implemented.");
  }

  /**
   * Get averaged out measurements from the last hour
   *
   * @returns {MeasurementRaw[]}
   * @memberof LuftdatenService
   */
  public getAverageLastHourMeasurements(): MeasurementRaw[] {
    throw new Error("Method not implemented.");
  }

  /**
   * Get averaged out measurements from the last 24 hours
   *
   * @returns {MeasurementRaw[]}
   * @memberof LuftdatenService
   */
  public getAverageLastDayMeasurements(): MeasurementRaw[] {
    throw new Error("Method not implemented.");
  }
}
