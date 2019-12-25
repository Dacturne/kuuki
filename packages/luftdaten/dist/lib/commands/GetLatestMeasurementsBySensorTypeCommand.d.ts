import { ICommand } from "../interfaces/ICommand";
import { IFetch } from "../interfaces/IFetch";
import { MeasurementRaw } from "../models/MeasurementRaw";
export declare class GetLatestMeasurementsBySensorTypeCommand implements ICommand {
    private _fetch;
    private _sensorType;
    private _path;
    constructor(_fetch: IFetch, _sensorType: string | string[], _path: string);
    execute(): Promise<MeasurementRaw[]>;
    private buildUrl;
}
