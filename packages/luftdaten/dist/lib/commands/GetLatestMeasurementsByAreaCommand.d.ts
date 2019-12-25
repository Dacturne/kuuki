import { ICommand } from "../interfaces/ICommand";
import { IFetch } from "../interfaces/IFetch";
import { MeasurementRaw } from "../models/MeasurementRaw";
export declare class GetLatestMeasurementsByAreaCommand implements ICommand {
    private _fetch;
    private _path;
    private _lat;
    private _lon;
    private _dist;
    constructor(_fetch: IFetch, _path: string, _lat: number, _lon: number, _dist: number);
    execute(): Promise<MeasurementRaw[]>;
    private buildUrl;
}
