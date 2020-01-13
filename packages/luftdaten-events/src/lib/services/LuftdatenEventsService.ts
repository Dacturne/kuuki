import { LuftdatenService } from "@kuuki/luftdaten";
import { RefreshOptions } from "../models/RefreshOptions";
import { EventEmitter } from "events";
import { MeasurementRaw } from "@kuuki/luftdaten/dist/lib/models/MeasurementRaw";
import { MeasurementRepository } from "../repositories/MeasurementRepository";
import { schedule } from "node-cron"

export class LuftdatenEventsService extends EventEmitter {
  constructor(private _api: LuftdatenService, private _repo: MeasurementRepository, private refreshOptions?: RefreshOptions) {
    super();
  }

  public async track(opts: RefreshOptions): Promise<void> {
    // Track what we want
    Object.keys(opts).forEach(async key => {
      console.log("Track: ", key);
      console.log("with crontab: ", opts[key].crontab);
      const args = {...opts[key]};
      delete args.crontab;
      console.log("and args:");
      console.log(args);
      // Ugly for now TODO: Think of a nicer way for invocation
      if (key === "getAverageLastHourMeasurements") {
        throw new Error('Not implemented');
        // await this._api.getAverageLastHourMeasurements();
      }
      if (key === "getAverageLatestMeasurements") {
        throw new Error('Not implemented');
        // await this._api.getAverageLatestMeasurements();
      }
      if (key === "getLatestMeasurements") {
        console.log(`Scheduled [ getLatestMeasurements ] with [ ${opts[key].crontab} ]`);
        schedule(opts[key].crontab, this._getLatestMeasurementsHandler.bind(this));
      }
      if (key === "getLatestMeasurementsByArea") {
        throw new Error('Not implemented');
        // await this._api.getLatestMeasurementsByArea(args.lat, args.lon, args.dist);
      }
      if (key === "getLatestMeasurementsByBox") {
        throw new Error('Not implemented');
        // await this._api.getLatestMeasurementsByBox(args.lat1, args.lon1, args.lat2, args.lon2);
      }
      if (key === "getLatestMeasurementsByCountry") {
        throw new Error('Not implemented');
        // await this._api.getLatestMeasurementsByCountry(args.country);
      }
      if (key === "getLatestMeasurementsBySensorType") {
        throw new Error('Not implemented');
        // await this._api.getLatestMeasurementsBySensorType(args.sensorType);
      }
    });
  }

  private async _checkMeasurementExistance(measurement: MeasurementRaw): Promise<boolean> {
    const { id, timestamp } = measurement;
    try {
      const exists = await this._repo.exists({ id, timestamp });
      return Promise.resolve(exists);
    } catch(err) {
      return Promise.reject(err);
    }
  }

  private _createMeasurement(measurement: MeasurementRaw): Promise<boolean> {
    const { id, timestamp } = measurement;
    try {
      return this._repo.create({ id, timestamp }, measurement);
    } catch(err) {
      Promise.reject(err);
    }
  }

  private async _getLatestMeasurementsHandler() {
    console.log(`getLatestMeasurements cron fired [${getTime()}]`);
    const measurements = await this._api.getLatestMeasurements();
    await Promise.all(measurements.map(async measurement => {
      const exists = await this._checkMeasurementExistance(measurement);
      if (!exists) {
        await this._measurementExistsHandler(measurement);
      }
      return Promise.resolve();
    }));
  }

  private async _measurementExistsHandler(measurement: MeasurementRaw): Promise<any> {
    try {
      await this._createMeasurement(measurement);
      this.emit("measurement", {
        source: "getLatestMeasurements",
        data: measurement
      });
      Promise.resolve();
    } catch(err) {
      Promise.reject(err);
    }
  }
}


export function getTime(): string {
  return new Date().toISOString()
  .replace(/([0-9]){4}(-[0-9]{2}){2}/, '')
  .replace(/T/, '')
  .replace(/\..+/, '');
}
