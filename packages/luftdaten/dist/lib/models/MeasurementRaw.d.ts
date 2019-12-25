import { Sensor } from "./Sensor";
import { StationLocation } from "./StationLocation";
import { SensorDataValue } from "./SensorDataValue";
export declare type MeasurementRaw = {
    id: number;
    sampling_rate?: any;
    timestamp: string;
    location: StationLocation;
    sensor: Sensor;
    sensordatavalues: SensorDataValue[];
};
