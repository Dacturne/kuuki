import { ICommand } from "../interfaces/ICommand";
import { IFetch } from "../interfaces/IFetch";
import { MeasurementRaw } from "../models/MeasurementRaw";

export class GetMeasurementsCommand implements ICommand {
  constructor(
    private _fetch: IFetch,
    private _path: string
  ) {}

  public async execute(): Promise<MeasurementRaw[]> {
    const response = await this._fetch(this._path);
    const measurements = await response.json();
    return measurements;
  }
}
