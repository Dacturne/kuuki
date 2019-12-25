import { IFetch } from "../interfaces/IFetch";
import { ICommand } from "../interfaces/ICommand";
import { MeasurementRaw } from "../models/MeasurementRaw";
export declare class GetLatestMeasurementsByCountryCommand implements ICommand {
    private _fetch;
    private _path;
    private _country;
    constructor(_fetch: IFetch, _path: string, _country: string);
    execute(): Promise<MeasurementRaw[]>;
    private buildUrl;
}
