import { ICommand } from "../interfaces/ICommand";
import { IFetch } from "../interfaces/IFetch";
import { MeasurementRaw } from "../models/MeasurementRaw";

export class GetLatestMeasurementsByAreaCommand implements ICommand {
  constructor(
    private _fetch: IFetch,
    private _path: string,
    private _lat: number,
    private _lon: number,
    private _dist: number
  ) {}

  public async execute() {
    const url = this.buildUrl();
    const response = await this._fetch(url);
    const measurements: MeasurementRaw[] = await response.json();
    return measurements;
  }

  private buildUrl(): string {
    const url = this._path + "area=";
    const query = [this._lat, this._lon, this._dist].join(",");
    return url + query;
  }
}
