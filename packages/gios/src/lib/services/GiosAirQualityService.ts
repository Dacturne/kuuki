import fetch from "node-fetch";
import { IPJPApi } from "../interfaces/IPJPApi";
import DEFAULTS from "../config";
import { MeasurementStationRaw } from "../models/MeasurementStationRaw";
import { ApiPaths } from "../models/ApiPaths";
import { MeasurementStationSensorRaw } from "../models/MeasurementStationSensorRaw";
import { SensorDataRaw } from "../models/SensorDataRaw";
import { PJPApiConfig } from "../models/PJPApiConfig";
import { isTrailingSlash } from "../utils";

const fetchRetry = async (url, options, n) => {
  for (let i = 0; i < n; i++) {
      try {
          return await fetch(url, options);
      } catch (err) {
          const isLastAttempt = i + 1 === n;
          if (isLastAttempt) throw err;
      }
  }
};

export class GiosAirQualityService implements IPJPApi {

  protected domain: string;
  protected paths: Required<ApiPaths>;

  constructor(config?: PJPApiConfig) {
    this.bootstrapEndpoints(config);
  }

  public async getStations(): Promise<MeasurementStationRaw[]> {
    try {
      const response = await fetchRetry(
        `${this.domain}/${DEFAULTS.BASE_PATH}/${this.paths.allStationsPath}`,
        {},
        5
      );
      const stations: MeasurementStationRaw[] = await response.json();
      return stations;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getSensors(
    stationId: number | string
  ): Promise<MeasurementStationSensorRaw[]> {
    try {
      const response = await fetchRetry(
        `${this.domain}/${this.paths.basePath}/${this.paths.sensorsPath}/${stationId}`,
        {},
        5
      );
      const sensors: MeasurementStationSensorRaw[] = await response.json();
      return sensors;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getMeasurements(
    sensorId: number | string
  ): Promise<SensorDataRaw> {
    try {
      const response = await fetchRetry(
        `${this.domain}/${this.paths.basePath}/${this.paths.sensorDataPath}/${sensorId}`,
        {},
        5
      );
      const data: SensorDataRaw = await response.json();
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  protected bootstrapEndpoints(config: PJPApiConfig) {
    if (config?.domain) {
      if (isTrailingSlash(config.domain)) {
        // remove trailing slashes
        this.domain = config.domain.slice(0, -1);
      } else {
        this.domain = config.domain;
      }
    } else {
      this.domain = DEFAULTS.DOMAIN;
    }

    // Load defaults to satisfy Required<T>
    this.paths = {
      basePath: DEFAULTS.BASE_PATH,
      allStationsPath: DEFAULTS.ALL_STATIONS_PATH,
      sensorsPath: DEFAULTS.SENSORS_PATH,
      sensorDataPath: DEFAULTS.SENSOR_DATA_PATH,
    };

    // Override defaults
    if (config?.paths) {
      Object.keys(config.paths).forEach(path => {
        this.paths[path] = config.paths[path];
      });
    }
  }

}
