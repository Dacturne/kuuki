import { MeasurementStationRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationRaw";
import { EventEmitter } from "events";
import { MeasurementStationSensor } from "./MeasurementStationSensor";

export type MeasurementStationIdentifier = {
  id: number;
}

// tslint:disable-next-line:interface-name
export declare interface MeasurementStation {
  on(event: "update", listener: Function): this;
  on(event: "error", listener: Function): this;
}
export class MeasurementStation extends EventEmitter {
  private readonly _identifier: MeasurementStationIdentifier;
  public sensors: MeasurementStationSensor[];
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
