import { ICommand } from "../interfaces/ICommand";
import { IFetch } from "../interfaces/IFetch";
import { MeasurementRaw } from "../models/MeasurementRaw";

export class GetLatestMeasurementsByBoxCommand implements ICommand {
  constructor(
    private _fetch: IFetch,
    private _path: string,
    private _lat1: number,
    private _lon1: number,
    private _lat2: number,
    private _lon2: number
  ) {}

  public async execute() {
    const url = this.buildUrl();
    const response = await this._fetch(url);
    const measurements: MeasurementRaw[] = await response.json();
    return measurements;
  }

  private buildUrl(): string {
    const url = this._path + "box=";
    const query = [this._lat1, this._lon1, this._lat2, this._lon2].join(",");
    return url + query;
  }
}
