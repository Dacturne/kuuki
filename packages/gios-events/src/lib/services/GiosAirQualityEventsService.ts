import { EventEmitter } from "events";
import { MeasurementStation } from "../models/MeasurementStation";
import { MeasurementStationSensor } from "../models/MeasurementStationSensor";
import { GiosAirQualityService } from "@kuuki/gios";
import { schedule } from "node-cron";
import { SensorDataRaw } from "@kuuki/gios/dist/lib/models/SensorDataRaw";
import { Measurement } from "../models/Measurement";

// tslint:disable-next-line:interface-name
export declare interface GiosAirQualityEventsService {
  on(event: "station_joined", listener: (station: MeasurementStation) => void): this;
  on(event: "station_left", listener: (id: number) => void): this;
  on(event: "station_refreshed", listener: () => void): this;
  on(event: "sensor_joined", listener: (sensor: MeasurementStationSensor, station: MeasurementStation) => void): this;
  on(event: "sensor_left", listener: (sensorId: number, station: MeasurementStation) => void): this;
  on(event: "sensor_data"|"sensor_data_error", listener: (station: MeasurementStation, sensor: MeasurementStationSensor, sensorDataRaw: SensorDataRaw) => void): this
  addListener(event: "station_joined", listener: (station: MeasurementStation) => void): this;
  addListener(event: "station_left", listener: (id: number) => void): this;
  addListener(event: "station_refreshed", listener: () => void): this;
  addListener(event: "sensor_joined", listener: (sensor: MeasurementStationSensor, station: MeasurementStation) => void): this;
  addListener(event: "sensor_left", listener: (sensorId: number, station: MeasurementStation) => void): this;
  addListener(event: "sensor_data"|"sensor_data_error", listener: (station: MeasurementStation, sensor: MeasurementStationSensor, measurement: SensorDataRaw) => void): this
}

export class GiosAirQualityEventsService extends EventEmitter {

  private _stations: MeasurementStation[];

  constructor(
    private api: GiosAirQualityService,
    private refreshOptions: {
      stations: string, // TODO: defaults, every 15', 30', 45', 55'
      sensors: string, // TODO: default: fires after station update
      measurements: string // default: every 1h at 1min
    }
  ) {
    super();
    this.on("station_left", (id) => {
      // remove the station from the store, as further polls will fail
      console.log('listener is removing the station ', id);
      const station = this._stations.find(s => {
        return s.identifier.id === id;
      });
      console.log(this._stations.length);
      this._stations.splice(this._stations.indexOf(station), 1);
      console.log('removed...');
      console.log(this._stations.length);
    });
    this.on("station_joined", async (station) => {
      console.log('listener is adding the station with id', station.identifier.id);
      // fetch sensors for the station
      const sensors = (await this.api.getSensors(station.identifier.id))
        .map(s => new MeasurementStationSensor(s));
      station.sensors = sensors;
      this._stations.push(station);
    });
    this.on("sensor_left", async (id, station) => {
      console.log(`Sensor: [${id}] is getting removed from station [${station.identifier.id}]`);
      station?.sensors?.splice(this._stations.indexOf(station), 1);
    });
    this.on("sensor_joined", async (sensor, station) => {
      console.log(`Sensor: [${sensor.identifier.id}] is getting added to station [${station.identifier.id}]`);
      station?.sensors?.push(sensor);
    });
    this.on("sensor_data_error", async(station, sensor, sensorDataRaw) => {
      console.log(
        `[Defective sensor]: ${sensor.identifier.id} at station ${station.identifier.id}`
      );
    });
    this.on("sensor_data", async (station, sensor, sensorDataRaw) => {
      // console.log(sensorDataRaw.values[0]);
    });
  }

  public async initialize(): Promise<void> {
    // retrieve a list of stations
    const stationsRaw = await this.api.getStations();
    this._stations = stationsRaw.map(station => new MeasurementStation(station));
    console.log(`[Server] Fetched all stations (${this._stations.length})`);

    // assign sensors to the station
    let sensors = 0;
    const sensorAssignmentPromises = this._stations.map(async (station) => {
      const sensorsRaw = await this.api.getSensors(station.identifier.id);
      sensors += sensorsRaw.length;
      station.sensors = sensorsRaw.map(sensor => new MeasurementStationSensor(sensor));
      return Promise.resolve()
    });
    await Promise.all(sensorAssignmentPromises);
    console.log(`[Server] Fetched all sensors (${sensors})`);

    // let measurementsCount = 0;
    // const measurementPromises = this._stations.map(async (station) => {
    //   const measurements = station.sensors.map(async (sensor) => {
    //     sensor.latestMeasurement = await this.api.getMeasurements(sensor.identifier.id);
    //     measurementsCount += 60;
    //     return Promise.resolve();
    //   });
    //   return await Promise.all(measurements);
    // })
    // await Promise.all(measurementPromises);
    // console.log(`Fetched all sensor measurements (${measurementsCount})`);

    console.log('[Server] Synced up...');
    this.assignSchedules();
    return Promise.resolve();
  }

  public getStations() {
    return this._stations;
  }

  public getSensors() {
    return this._stations.map(station => station.sensors);
  }

  public async refreshStations(): Promise<void> {
    const refreshedStations = await this.api.getStations();
    const prevIds = this._stations.map(station => station.identifier.id);
    const newIds = refreshedStations.map(station => station.id).map(Number);
    const missingIds = prevIds.filter(id => !newIds.includes(id));
    if (missingIds?.length > 0) {
      missingIds.forEach(id => this.emit("station_left", id));
    }
    const addedIds = newIds.filter(id => !prevIds.includes(id));
    if (addedIds?.length > 0) {
      addedIds.forEach(id => {
        const station = new MeasurementStation(
          refreshedStations.find(s => s.id === id)
        );
        this.emit("station_joined", station);
      });
    }
    this.emit("station_refreshed");
    return Promise.resolve();
  }

  public async refreshSensors(): Promise<void> {
    const promises = this._stations.map(async station => {
      const refreshedSensors = await this.api.getSensors(station.identifier.id);
      const prevIds = station.sensors.map(sensor => sensor.identifier.id).map(Number);
      const newIds = refreshedSensors.map(sensor => sensor.id).map(Number);
      const missingIds = prevIds.filter(id => !newIds.includes(id));
      if (missingIds?.length > 0) {
        missingIds.forEach(id => {
          this.emit("sensor_left", id, station)
        });
      }
      const addedIds = newIds.filter(id => !prevIds.includes(id));
      if (addedIds?.length > 0) {
        addedIds.forEach(id => {
          const sensor = new MeasurementStationSensor(refreshedSensors.find(s => s.id === id));
          this.emit("sensor_joined", sensor, station);
        });
      }
      return Promise.resolve();
    });
    await Promise.all(promises);
    return Promise.resolve();
  }

  public async refreshMeasurements(): Promise<void> {
    const promises = this._stations.map(async station => {
      const p = station.sensors.map(async sensor => {
        try {
          const sensorDataRaw = await this.api.getMeasurements(sensor.identifier.id);
          sensor.latestMeasurement = sensorDataRaw;
          if (sensorDataRaw?.values.length === 0) { // it's served but empty
            this.emit("sensor_data_error", station, sensor, sensorDataRaw);
            return Promise.resolve(true);
          }
          this.emit("sensor_data", station, sensor, sensorDataRaw);
          const measurement: Measurement = {
            key: sensorDataRaw.key,
            date: sensorDataRaw.values[0].date,
            value: sensorDataRaw.values[0].value
          }
          this.emit("measurement", station, sensor, measurement);
        } catch(error) {
          console.log("failed to refresh measurement on ", sensor.identifier.id);
          return Promise.reject(error);
        }
        return Promise.resolve();
      });
      await Promise.all(p);
      return Promise.resolve();
    });
    await Promise.all(promises);
    return Promise.resolve();
  }

  private assignSchedules() {
    schedule(this.refreshOptions.stations, async () => {
      console.log("Refreshing stations... ");
      try {
        await this.refreshStations();
      } catch(error) {
        console.error("Refreshing stations failed.");
        throw error;
      } finally {
        // TODO: run sensors schedule if it was not set manually
      }
    });
    schedule(this.refreshOptions.sensors, async () => {
      console.log("Refreshing sensors...");
      try {
        await this.refreshSensors();
      } catch(error) {
        console.error("Refreshing sensors failed.");
        throw error;
      }
    });
    schedule(this.refreshOptions.measurements, async() => {
      console.log("[Started] Getting measurements...");
      try {
        await this.refreshMeasurements();
      } catch(error) {
        console.error("Refreshing measurements failed.");
        throw error;
      } finally {
        console.log("[Finished] Getting measurements");
      }
    });
  }
}
