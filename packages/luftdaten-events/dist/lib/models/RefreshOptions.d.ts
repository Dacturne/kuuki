export declare type RefreshOptions = {
    getAverageLastHourMeasurements?: GetMeasurementsArgs;
    getAverageLatestMeasurements?: GetMeasurementsArgs;
    getLatestMeasurements?: GetMeasurementsArgs;
    getLatestMeasurementsByArea?: GetLatestMeasurementsByAreaArgs;
    getLatestMeasurementsByBox?: GetLatestMeasurementsByBoxArgs;
    getLatestMeasurementsByCountry?: GetLatestMeasurementsByCountryArgs;
    getLatestMeasurementsBySensorType?: GetLatestMeasurementsBySensorTypeArgs;
};
export declare type GetMeasurementsArgs = {
    crontab: string;
};
export declare type GetLatestMeasurementsByAreaArgs = {
    lat: number;
    lon: number;
    dist: number;
    crontab: string;
};
export declare type GetLatestMeasurementsByBoxArgs = {
    lat1: number;
    lon1: number;
    lat2: number;
    lon2: number;
    crontab: string;
};
export declare type GetLatestMeasurementsByCountryArgs = {
    country: string;
    crontab: string;
};
export declare type GetLatestMeasurementsBySensorTypeArgs = {
    sensorType: string | string[];
    crontab: string;
};
