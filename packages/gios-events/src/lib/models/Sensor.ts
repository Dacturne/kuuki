import { EventEmitter } from "events";
import { MeasurementStationSensorRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationSensorRaw";
import { GiosAirQualityEventsService } from "../services/GiosAirQualityEventsService";
import { Measurement } from "./Measurement";
import { SensorDataRaw } from "@kuuki/gios/dist/lib/models/SensorDataRaw";

type SensorIdentifier = {
  id: number;
}

export declare interface Sensor {
  on(event: "update"|"measurement", listener: (measurement: Measurement) => void): this;
  addListener(event: "update"|"measurement", listener: (measurement: Measurement) => void): this;
  emit(event: "update"|"measurement", measurement: Measurement): boolean;
}
export class Sensor extends EventEmitter {

  public readonly identifier: SensorIdentifier;
  public readonly paramCode: string;
  protected measurements: Measurement[] = []; // should hold 62 records or none
  private readonly _stationId: number;

  constructor(
    private readonly _raw: MeasurementStationSensorRaw,
    private _eventsApi: GiosAirQualityEventsService
  ) {
    super();
    this.identifier = { id: _raw.id };
    this.paramCode = _raw.param.paramCode;
    this._stationId = _raw.stationId;
    this.attachListeners();
  }

  public refreshData(raw: SensorDataRaw): void {
    // check if there are any changes to the data
    if (this.measurements.length === 0) { // fresh instance
      const measurements = raw.values.map(rd => {
        const measurement: Measurement = {
          date: rd.date,
          value: rd.value
        };
        return measurement;
      });
      this.measurements = measurements;
      // do not emit anything, it's probably initialized or the app restarted
    } else { // something is already stored
      // compare values and emit events
      const latestDate = this.measurements[0].date;
      raw.values.forEach(({date, value}) => {
        // compare values (we might have nulls)
        const index = this.measurements.findIndex((m, idx) => m.date === date);
        if (index >= 0) {
          if (this.measurements[index].value != value) {
            // trust the newer data (replace);
            this.measurements[index].value = value;
            this.emit("update", this.measurements[index]);
          }
        }
        // it could be a new measurement
        if (date > latestDate) {
          // add it to our list (at the start)
          this.measurements.splice(0, 0, {date, value});
          if (value != null) {
            // emit measurement as it seems valid already
            this.emit("measurement", {date, value});
          }
        }
      });
      // remove oldest elements if there are more than 62 elements
      const count = this.measurements.length;
      if (count > 62) {
        for (let i=count-62; i>0; i--)
          this.measurements.pop();
      }
    }
  }

  public getLatestMeasurement(): Measurement {
    return this.measurements[0];
  }

  private attachListeners(): void {
    this.on("update", (measurement) => {
      this._eventsApi.emit("measurement_update", this._stationId, this, measurement);
    });
    this.on("measurement", (measurement) => {
      this._eventsApi.emit("measurement", this._stationId, this, measurement);
    });
  }
}
