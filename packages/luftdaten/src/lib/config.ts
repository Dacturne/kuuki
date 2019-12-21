import { ApiPaths } from "./models/ApiPaths";

const API_PATHS: Required<ApiPaths> = {
  LATEST_MEASUREMENTS_PATH: "https://data.sensor.community/static/v1/data.json",
  AVERAGE_LATEST_MEASUREMENTS_PATH: "https://api.luftdaten.info/static/v2/data.json",
  AVERAGE_LAST_HOUR_MEASUREMENTS_PATH: "https://data.sensor.community/static/v2/data.1h.json",
  AVERAGE_LAST_DAY_MEASUREMENTS_PATH: "https://data.sensor.community/static/v2/data.24h.json"
}

const DEFAULTS = {
  API_PATHS
}

export default DEFAULTS;
