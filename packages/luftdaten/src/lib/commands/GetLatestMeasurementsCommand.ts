import { ICommand } from "../interfaces/ICommand";
import { IFetch } from "../interfaces/IFetch";
import { MeasurementRaw } from "../models/MeasurementRaw";

export class GetLatestMeasurementsCommand implements ICommand {
  constructor(private readonly _fetch: IFetch, private readonly _url: string) {
  }

  public async execute(): Promise<MeasurementRaw[]> {
    const response = await this._fetch(this._url);
    const measurements: MeasurementRaw[] = await response.json();
    return measurements;
  }
}
