import { EventEmitter } from "events";
import { GiosAirQualityService } from "@kuuki/gios";
import { schedule } from "node-cron";
import { SensorDataRaw } from "@kuuki/gios/dist/lib/models/SensorDataRaw";
import { RefreshOptions } from "../models/RefreshOptions";
import { getTime } from "../utils";
import { StationRepository } from "../repositories/StationRepository";
import { SensorRepository } from "../repositories/SensorRepository";
import { MeasurementRepository, MeasurementPartitioningKey } from "../repositories/MeasurementRepository";
import levelup from "levelup";
import leveldown from "leveldown";
import ttl from "level-ttl";
import { MeasurementStationSensorRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationSensorRaw";
import { MeasurementStationRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationRaw";
import { Measurement } from "../models/Measurement";

// tslint:disable-next-line:interface-name
export declare interface GiosAirQualityEventsService {
  // TODO: find a solution for strongly typed EventEmitter
  on(event: "station_joined", listener: (station: MeasurementStationRaw) => void): this;
  on(event: "station_left", listener: (id: number) => void): this;
  on(event: "sensor_joined", listener: (sensor: MeasurementStationSensorRaw, station: MeasurementStationRaw) => void): this;
  on(event: "sensor_left", listener: (sensorId: number, station: MeasurementStationRaw) => void): this;
  on(event: "stations_refreshed"|"sensors_refreshed"|"data_refreshed", listener: () => void): this;
  on(event: "data", listener: (station: MeasurementStationRaw, sensor: MeasurementStationSensorRaw, sensorDataRaw: SensorDataRaw) => void): this
  on(event: "measurement"|"measurement_update", listener: (stationId: number, sensor: MeasurementStationSensorRaw, measurement: Measurement) => void): this;
  addListener(event: "station_joined", listener: (station: MeasurementStationRaw) => void): this;
  addListener(event: "station_left", listener: (id: number) => void): this;
  addListener(event: "sensor_joined", listener: (sensor: MeasurementStationSensorRaw, station: MeasurementStationRaw) => void): this;
  addListener(event: "sensor_left", listener: (sensorId: number, station: MeasurementStationRaw) => void): this;
  addListener(event: "stations_refreshed"|"sensors_refreshed"|"data_refreshed", listener: () => void): this;
  addListener(event: "data", listener: (station: MeasurementStationRaw, sensor: MeasurementStationSensorRaw, sensorDataRaw: SensorDataRaw) => void): this
  addListener(event: "measurement"|"measurement_update", listener: (stationId: number, sensor: MeasurementStationSensorRaw, measurement: Measurement) => void): this;
  emit(event: "station_joined", station: MeasurementStationRaw): boolean;
  emit(event: "station_left", id: number): boolean;
  emit(event: "sensor_joined", sensor: MeasurementStationSensorRaw, station: MeasurementStationRaw): boolean;
  emit(event: "sensor_left", sensorId: number, station: MeasurementStationRaw): boolean;
  emit(event: "stations_refreshed"|"sensors_refreshed"|"data_refreshed"): boolean;
  emit(event: "data", station: MeasurementStationRaw, sensor: MeasurementStationSensorRaw, sensorDataRaw: SensorDataRaw): boolean;
  emit(event: "measurement"|"measurement_update", stationId: number, sensor: MeasurementStationSensorRaw, measurement: Measurement): boolean;
}

export class GiosAirQualityEventsService extends EventEmitter {

  constructor(
    private api: GiosAirQualityService,
    private refreshOptions: RefreshOptions,
    private _stationRepository: StationRepository = new StationRepository(ttl(levelup(leveldown("./db/stations")))),
    private _sensorRepository: SensorRepository = new SensorRepository(ttl(levelup(leveldown("./db/sensors")))),
    private _measurementRepository: MeasurementRepository = new MeasurementRepository(ttl(levelup(leveldown("./db/measurements"))))
  ) {
    super();
  }

  public async initialize(): Promise<void> {
    this.assignSchedules();
    return Promise.resolve();
  }

  public async getStations(): Promise<MeasurementStationRaw[]> {
    return await this._stationRepository.getAll();
  }

  public async findStation(id: number) {
    const stations = await this._stationRepository.find({ identifier: id });
    return stations;
  }

  public async getSensors(): Promise<MeasurementStationSensorRaw[]> {
    return await this._sensorRepository.getAll()
  }

  public async refreshStations(): Promise<void> {
    let refreshedStations;
    try {
      refreshedStations = await this.api.getStations();
    } catch(error) {
      refreshedStations = [];
    }
    for (const station of refreshedStations) {
      if (!await this._stationRepository.exists({ identifier: station.id })) {
        await this._stationRepository.create({identifier: station.id}, station);
        this.emit("station_joined", station);
      }
    }
    const prevIds = await (await this._stationRepository.getAll())?.map(station => station.id);
    const newIds = await refreshedStations?.map(station => station.id);
    const missingIds = prevIds?.filter(id => !newIds.includes(id));
    if (missingIds?.length > 0) {
      missingIds.forEach(id => this.emit("station_left", id));
    }
    this.emit("stations_refreshed");
    return Promise.resolve();
  }

  public async refreshSensors(): Promise<void> {
    const stations = await this._stationRepository.getAll();
    for(const station of stations) {
      let refreshedSensors;
      try {
        refreshedSensors = await this.api.getSensors(station.id);
      } catch(err) {
        refreshedSensors = [];
      }
      const prevIds = (await this.getSensors())?.map(sensor => sensor.id);
      const newIds = refreshedSensors?.map(sensor => sensor.id);
      const missingIds = prevIds?.filter(id => !newIds.includes(id));
      if (missingIds?.length > 0) {
        missingIds.forEach(id => {
          this.emit("sensor_left", id, station)
        });
      }
      const addedIds = newIds?.filter(id => !prevIds.includes(id));
      if (addedIds?.length > 0) {
        addedIds.forEach(id => {
          const sensor = refreshedSensors?.find(s => s.id === id);
          this._sensorRepository.create({ identifier: sensor.id }, sensor);
          this.emit("sensor_joined", sensor, station);
        });
      }
    }
    return Promise.resolve();
  }

  public async refreshMeasurements(): Promise<void> {
    const sensors = await this._sensorRepository.getAll();
    for (const sensor of sensors) {
      // Grab fresh data
      let sensorDataRaw;
      try {
        sensorDataRaw = await this.api.getMeasurements(sensor.id);
      } catch(error) {
        sensorDataRaw = null;
      }
      if (sensorDataRaw) {
        for (const measurement of sensorDataRaw.values) {
          const key: MeasurementPartitioningKey = { sensorId: sensor.id, dateTime: measurement.date };
          const exists = await this._measurementRepository.exists(key);

          if (exists === false) {
            if (measurement.value != null) {
              await this._measurementRepository.create(key, measurement);
              this.emit("measurement", sensor.stationId, sensor, measurement);
            }
          } else {
            // check if data changed
            const latest = await this._measurementRepository.find({
              sensorId: sensor.id,
              dateTime: measurement.date
            });
            // compare latest value with the freshly arrived one
            if (latest[0].value !== measurement.value) {
              // this._measurementRepository.update(key, measurement);
              if (measurement.value != null) {
                this._measurementRepository.create(key, measurement);
                this.emit("measurement_update", sensor.stationId, sensor, measurement);
              }
            }
          }
        }
      }
    }
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
}
