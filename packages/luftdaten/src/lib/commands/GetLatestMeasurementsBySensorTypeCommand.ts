import { ICommand } from "../interfaces/ICommand";
import { IFetch } from "../interfaces/IFetch";
import { MeasurementRaw } from "../models/MeasurementRaw";

export class GetLatestMeasurementsBySensorTypeCommand implements ICommand {
  constructor(
    private _fetch: IFetch,
    private _sensorType: string | string[],
    private _path: string
  ) {}

  public async execute(): Promise<MeasurementRaw[]> {
    if (this._sensorType.length === 0) {
      return Promise.reject("Empty array passed to query");
    }
    const url = this.buildUrl();
    const response = await this._fetch(url);
    const measurements: MeasurementRaw[] = await response.json();
    return measurements;
  }

  private buildUrl(): string {
    const url = this._path + "type=";
    let query: string;
    if (Array.isArray(this._sensorType)) {
      query = (this._sensorType as string[]).join(",");
    } else {
      query = this._sensorType;
    }
    return url + query;
  }
}
