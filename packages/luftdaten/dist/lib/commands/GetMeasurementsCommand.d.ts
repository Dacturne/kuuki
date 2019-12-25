import { ICommand } from "../interfaces/ICommand";
import { IFetch } from "../interfaces/IFetch";
import { MeasurementRaw } from "../models/MeasurementRaw";
export declare class GetMeasurementsCommand implements ICommand {
    private _fetch;
    private _path;
    constructor(_fetch: IFetch, _path: string);
    execute(): Promise<MeasurementRaw[]>;
}
