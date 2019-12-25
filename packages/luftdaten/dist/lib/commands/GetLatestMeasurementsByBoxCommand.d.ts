import { ICommand } from "../interfaces/ICommand";
import { IFetch } from "../interfaces/IFetch";
import { MeasurementRaw } from "../models/MeasurementRaw";
export declare class GetLatestMeasurementsByBoxCommand implements ICommand {
    private _fetch;
    private _path;
    private _lat1;
    private _lon1;
    private _lat2;
    private _lon2;
    constructor(_fetch: IFetch, _path: string, _lat1: number, _lon1: number, _lat2: number, _lon2: number);
    execute(): Promise<MeasurementRaw[]>;
    private buildUrl;
}
