import { Sensor } from "./Sensor";
import { StationLocation } from "./StationLocation";
import { SensorDataValue } from "./SensorDataValue";

export type MeasurementRaw = {
  id: number;
  sampling_rate?: any;
  timestamp: string;
  location: StationLocation;
  sensor: Sensor;
  sensordatavalues: SensorDataValue[];
};
