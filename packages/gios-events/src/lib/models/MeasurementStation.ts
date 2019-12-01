import { MeasurementStationRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationRaw";
import { EventEmitter } from "events";
import { Sensor } from "./Sensor";

export type MeasurementStationIdentifier = {
  id: number;
}

export class MeasurementStation extends EventEmitter {
  private readonly _identifier: MeasurementStationIdentifier;
  public sensors: Sensor[]; // TODO: change to Map<number, Sensor>?
  get identifier() {
    return this._identifier;
  }
  constructor(protected readonly raw: MeasurementStationRaw) {
    super();
    const id: MeasurementStationIdentifier = {
      id: raw.id
    };
    this._identifier = id;
  }
}
