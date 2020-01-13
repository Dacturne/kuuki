import { StationLocation } from "./StationLocation";
import { Sensor } from "./Sensor";
import { SensorDataValue } from "./SensorDataValue";
import { MeasurementRaw } from "@kuuki/luftdaten/dist/lib/models/MeasurementRaw";

class Station {
  protected readonly id: number;
  protected readonly location: StationLocation;
  protected readonly sensor: Sensor;
  protected measurements: Map<string, SensorDataValue[]>;
  private readonly _raw: MeasurementRaw;
}
