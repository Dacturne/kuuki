import { MeasurementRaw } from "../models/MeasurementRaw";
import { ILuftdatenService } from "../interfaces/ILuftdatenService";
import { LuftdatenServiceConfig } from "../models/LuftdatenServiceConfig";
export declare class LuftdatenService implements ILuftdatenService {
    private _fetch;
    private readonly _apiPaths;
    constructor(config?: LuftdatenServiceConfig);
    /**
     * Get raw measurements from the last 5 minutes
     *
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getLatestMeasurements(): Promise<MeasurementRaw[]>;
    /**
     * Get raw measurements from the last 5 minutes
     * API Query is filtered by sensor type
     *
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getLatestMeasurementsBySensorType(sensorType: string | string[]): Promise<MeasurementRaw[]>;
    /**
     * Get raw measurements from the last 5 minutes
     * API Query is filtered by box
     *
     * @param {number} lat1
     * @param {number} lon1
     * @param {number} lat2
     * @param {number} lon2
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getLatestMeasurementsByBox(lat1: number, lon1: number, lat2: number, lon2: number): Promise<MeasurementRaw[]>;
    /**
     * Get raw measurements from the last 5 minutes
     * API Query is filtered by area
     *
     * @param {number} lat
     * @param {number} lon
     * @param {number} dist
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getLatestMeasurementsByArea(lat: number, lon: number, dist: number): Promise<MeasurementRaw[]>;
    /**
     * Get raw measurements from the last 5 minutes
     * API Query is filtered by country
     *
     * @param {string} country
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getLatestMeasurementsByCountry(country: string): Promise<MeasurementRaw[]>;
    /**
     * Get averaged out measurements from the last 5 minutes
     *
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getAverageLatestMeasurements(): Promise<MeasurementRaw[]>;
    /**
     * Get averaged out measurements from the last hour
     *
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getAverageLastHourMeasurements(): Promise<MeasurementRaw[]>;
    /**
     * Get averaged out measurements from the last 24 hours
     *
     * @returns {Promise<MeasurementRaw[]>}
     * @memberof LuftdatenService
     */
    getAverageLastDayMeasurements(): Promise<MeasurementRaw[]>;
}
