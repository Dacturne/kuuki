import { MeasurementRaw } from "./MeasurementRaw";
import { StationLocation } from "./StationLocation";
import { Sensor } from "./Sensor";
import { SensorDataValue } from "./SensorDataValue";

class Station {
  protected readonly id: number;
  protected readonly location: StationLocation;
  protected readonly sensor: Sensor;
  protected measurements: Map<string, SensorDataValue[]>;
  private readonly _raw: MeasurementRaw;
}
