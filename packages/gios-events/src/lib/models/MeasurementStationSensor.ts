import { EventEmitter } from "events";
import { SensorDataRaw } from "@kuuki/gios/dist/lib/models/SensorDataRaw";
import { MeasurementStationSensorRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationSensorRaw";
import { GiosAirQualityEventsService } from "../services/GiosAirQualityEventsService";

type MeasurementStationSensorIdentifier = {
  id: number|string;
}

export declare interface MeasurementStationSensor {
  on(event: "update", listener: Function): this;
  on(event: "error", listener: Function): this;
}
export class MeasurementStationSensor extends EventEmitter {

  protected measurements: SensorDataRaw[]; // should hold 62 records or none
  protected _latestMeasurement: SensorDataRaw;
  public identifier: MeasurementStationSensorIdentifier;

  set latestMeasurement(measurement: SensorDataRaw) {
    this._latestMeasurement = measurement;
    this.emit("update");
  }

  constructor(protected _raw: MeasurementStationSensorRaw, private _eventsApi?: GiosAirQualityEventsService) {
    super();
    this.identifier = {
      id: _raw.id
    };
  }
  subscribe() {
    console.log(this.identifier.id, ' sends request for subscription...');
    // this?._eventsApi.subscribe(this);
  }
}
