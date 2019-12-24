import { IFetch } from "../interfaces/IFetch";
import { ICommand } from "../interfaces/ICommand";
import { MeasurementRaw } from "../models/MeasurementRaw";

export class GetLatestMeasurementsByCountryCommand implements ICommand {
  constructor(
    private _fetch: IFetch,
    private _path: string,
    private _country: string
  ) {}

  public async execute(): Promise<MeasurementRaw[]> {
    const url = this.buildUrl();
    const response = await this._fetch(url);
    const measurements: MeasurementRaw[] = await response.json();
    return measurements;
  }

  private buildUrl(): string {
    const url = this._path + "country=";
    return url + this._country;
  }

}
