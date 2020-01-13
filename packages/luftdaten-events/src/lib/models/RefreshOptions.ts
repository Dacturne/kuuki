export type RefreshOptions = {
  getAverageLastHourMeasurements?: GetMeasurementsArgs;
  getAverageLatestMeasurements?: GetMeasurementsArgs;
  getLatestMeasurements?: GetMeasurementsArgs;
  getLatestMeasurementsByArea?: GetLatestMeasurementsByAreaArgs;
  getLatestMeasurementsByBox?: GetLatestMeasurementsByBoxArgs;
  getLatestMeasurementsByCountry?: GetLatestMeasurementsByCountryArgs;
  getLatestMeasurementsBySensorType?: GetLatestMeasurementsBySensorTypeArgs;
};

export type GetMeasurementsArgs = {
  crontab: string;
};

export type GetLatestMeasurementsByAreaArgs = {
  lat: number;
  lon: number;
  dist: number;
  crontab: string;
};

export type GetLatestMeasurementsByBoxArgs = {
  lat1: number;
  lon1: number;
  lat2: number;
  lon2: number;
  crontab: string;
};

export type GetLatestMeasurementsByCountryArgs = {
  country: string;
  crontab: string;
};

export type GetLatestMeasurementsBySensorTypeArgs = {
  sensorType: string | string[];
  crontab: string;
};
