import { EventEmitter } from "events";
import { MeasurementStation } from "../models/MeasurementStation";
import { Sensor } from "../models/Sensor";
import { GiosAirQualityService } from "@kuuki/gios";
import { schedule } from "node-cron";
import { SensorDataRaw } from "@kuuki/gios/dist/lib/models/SensorDataRaw";
import { Measurement } from "../models/Measurement";
import { RefreshOptions } from "../models/RefreshOptions";
import { getTime } from "../utils";

// tslint:disable-next-line:interface-name
export declare interface GiosAirQualityEventsService {
  // TODO: find a solution for strongly typed EventEmitter
  on(event: "station_joined", listener: (station: MeasurementStation) => void): this;
  on(event: "station_left", listener: (id: number) => void): this;
  on(event: "sensor_joined", listener: (sensor: Sensor, station: MeasurementStation) => void): this;
  on(event: "sensor_left", listener: (sensorId: number, station: MeasurementStation) => void): this;
  on(event: "stations_refreshed"|"sensors_refreshed"|"data_refreshed", listener: () => void): this;
  on(event: "data", listener: (station: MeasurementStation, sensor: Sensor, sensorDataRaw: SensorDataRaw) => void): this
  on(event: "measurement"|"measurement_update", listener: (stationId: number, sensor: Sensor, measurement: Measurement) => void): this;
  addListener(event: "station_joined", listener: (station: MeasurementStation) => void): this;
  addListener(event: "station_left", listener: (id: number) => void): this;
  addListener(event: "sensor_joined", listener: (sensor: Sensor, station: MeasurementStation) => void): this;
  addListener(event: "sensor_left", listener: (sensorId: number, station: MeasurementStation) => void): this;
  addListener(event: "stations_refreshed"|"sensors_refreshed"|"data_refreshed", listener: () => void): this;
  addListener(event: "data", listener: (station: MeasurementStation, sensor: Sensor, sensorDataRaw: SensorDataRaw) => void): this
  addListener(event: "measurement"|"measurement_update", listener: (stationId: number, sensor: Sensor, measurement: Measurement) => void): this;
  emit(event: "station_joined", station: MeasurementStation): boolean;
  emit(event: "station_left", id: number): boolean;
  emit(event: "sensor_joined", sensor: Sensor, station: MeasurementStation): boolean;
  emit(event: "sensor_left", sensorId: number, station: MeasurementStation): boolean;
  emit(event: "stations_refreshed"|"sensors_refreshed"|"data_refreshed"): boolean;
  emit(event: "data", station: MeasurementStation, sensor: Sensor, sensorDataRaw: SensorDataRaw): boolean;
  emit(event: "measurement"|"measurement_update", stationId: number, sensor: Sensor, measurement: Measurement): boolean;
}

export class GiosAirQualityEventsService extends EventEmitter {

  private _stations: MeasurementStation[];

  constructor(private api: GiosAirQualityService, private refreshOptions: RefreshOptions) {
    super();
    this.attachListeners();
  }

  public async initialize(): Promise<void> {
    // retrieve a list of stations
    const stationsRaw = await this.api.getStations();
    this._stations = stationsRaw.map(station => new MeasurementStation(station));
    console.log(`[Server] Fetched all stations (${this._stations.length}) [${getTime()}]`);

    // assign sensors to the station
    let sensors = 0;
    const sensorAssignmentPromises = this._stations.map(async (station) => {
      const sensorsRaw = await this.api.getSensors(station.identifier.id);
      sensors += sensorsRaw.length;
      station.sensors = sensorsRaw.map(sensor => new Sensor(sensor, this));
      return Promise.resolve()
    });
    await Promise.all(sensorAssignmentPromises);
    console.log(`[Server] Fetched all sensors (${sensors}) [${getTime()}]`);

    // assign measurements to the sensors
    let measurementsCount = 0;
    const measurementPromises = this._stations.map(async (station) => {
      const measurements = station.sensors.map(async (sensor) => {
        const rawSensorData = await this.api.getMeasurements(sensor.identifier.id);
        sensor.refreshData(rawSensorData);
        measurementsCount += rawSensorData.values.length;
        return Promise.resolve();
      });
      return await Promise.all(measurements);
    })
    await Promise.all(measurementPromises);
    console.log(`[Server] Fetched all sensor measurements (${measurementsCount})`);
    console.log(`[Server] Synced up... [${getTime()}]`);
    this.assignSchedules();
    return Promise.resolve();
  }

  public getStations(): MeasurementStation[] {
    return this._stations;
  }

  public getSensors(): Sensor[] {
    const sensors: Sensor[] = [];
    for(const station of this._stations) {
      sensors.push(...station.sensors);
    }
    return sensors;
  }

  public async refreshStations(): Promise<void> {
    const refreshedStations = await this.api.getStations();
    const prevIds = this._stations.map(station => station.identifier.id);
    const newIds = refreshedStations.map(station => station.id);
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
    this.emit("stations_refreshed");
    return Promise.resolve();
  }

  public async refreshSensors(): Promise<void> {
    const promises = this._stations.map(async station => {
      const refreshedSensors = await this.api.getSensors(station.identifier.id);
      const prevIds = station.sensors.map(sensor => sensor.identifier.id);
      const newIds = refreshedSensors.map(sensor => sensor.id);
      const missingIds = prevIds.filter(id => !newIds.includes(id));
      if (missingIds?.length > 0) {
        missingIds.forEach(id => {
          this.emit("sensor_left", id, station)
        });
      }
      const addedIds = newIds.filter(id => !prevIds.includes(id));
      if (addedIds?.length > 0) {
        addedIds.forEach(id => {
          const sensor = new Sensor(refreshedSensors.find(s => s.id === id), this);
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
          this.emit("data", station, sensor, sensorDataRaw);
          sensor.refreshData(sensorDataRaw);
        } catch(error) {
          throw error;
        }
        return Promise.resolve();
      });
      await Promise.all(p);
      return Promise.resolve();
    });
    await Promise.all(promises);
    this.emit("data_refreshed");
    return Promise.resolve();
  }

  private assignSchedules() {
    schedule(this.refreshOptions.stations, async () => {
      console.log(`[Started] Refreshing stations... [${getTime()}]`);
      try {
        await this.refreshStations();
      } catch(error) {
        console.error("[Failed] Refreshing stations.");
        throw error;
      } finally {
        console.log(`[Finished] Refreshing stations. [${getTime()}]`);
      }
    });
    schedule(this.refreshOptions.sensors, async () => {
      console.log(`[Started] Refreshing sensors... [${getTime()}]`);
      try {
        await this.refreshSensors();
      } catch(error) {
        console.error("[Failed] Refreshing sensors.");
        throw error;
      } finally {
        console.log(`[Finished] Refreshing sensors. [${getTime()}]`);
      }
    });
    schedule(this.refreshOptions.measurements, async() => {
      console.log(`[Started] Getting measurements... [${getTime()}]`);
      try {
        await this.refreshMeasurements();
      } catch(error) {
        console.error("[Failed] Refreshing measurements.");
        throw error;
      } finally {
        console.log(`[Finished] Getting measurements... [${getTime()}]`);
      }
    });
  }

  private attachListeners() {
    this.on("station_left", (id) => {
      // remove the station from the store, as further polls will presumably fail
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
        .map(s => new Sensor(s, this));
      station.sensors = sensors;
      this._stations.push(station);
    });
    this.on("sensor_left", async (id, station) => {
      console.log(`Sensor: [${id}] is getting removed from station [${station.identifier.id}]`);
      station?.sensors?.splice(this._stations.indexOf(station), 1);
    });
    this.on("sensor_joined", async (sensor, station) => {
      console.log(`Sensor: [${sensor.identifier.id}] is getting added to station [${station.identifier.id}]`);
      // fetch measurements for the sensor
      const sensorRawData = await this.api.getMeasurements(station.identifier.id);
      sensor.refreshData(sensorRawData);
      station?.sensors?.push(sensor);
    });
  }
}
