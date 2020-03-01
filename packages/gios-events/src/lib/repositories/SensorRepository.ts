import { KVRepository } from "./KVRepository";
import levelup from "levelup";
import leveldown from "leveldown";
import ttl from "level-ttl";
import { MeasurementStationSensorRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationSensorRaw";

type SensorPartitioningKey = {
  identifier: number
}

export class SensorRepository extends KVRepository<
  MeasurementStationSensorRaw,
  SensorPartitioningKey
> {
  constructor(private _db: ttl.LevelTTL = ttl(levelup(leveldown("./db")))) {
    super();
  }

  public async find(key: SensorPartitioningKey): Promise<MeasurementStationSensorRaw[]> {
    try {
      const response = await this._db.get(JSON.stringify(key));
      return Promise.resolve([response]);
    } catch(error) {
      return Promise.reject(error);
    }
  }

  public async create(key: SensorPartitioningKey, item: MeasurementStationSensorRaw): Promise<boolean> {
    try {
      await this._db.put(
        JSON.stringify(key),
        JSON.stringify(item)
      );
      return Promise.resolve(true);
    } catch(error) {
      return Promise.reject(error);
    }
  }

  public async exists(key: SensorPartitioningKey): Promise<boolean> {
    try {
      await this._db.get(JSON.stringify(key));
      return Promise.resolve(true);
    } catch(error) {
      if (error.notFound) {
        return Promise.resolve(false);
      }
      return Promise.reject(error);
    }
  }

  public update(
    key: SensorPartitioningKey,
    item: Partial<MeasurementStationSensorRaw>
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public delete(key: SensorPartitioningKey): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public getAll(): Promise<MeasurementStationSensorRaw[]> {
    return new Promise((resolve, reject) => {
      const sensorArr = new Array<MeasurementStationSensorRaw>();
      const stream = this._db.createReadStream({
        valueAsBuffer: false,
        keyAsBuffer: false
      });
      stream.on("data", ({ key, value }) => {
        if (!key.match("!ttl!")) { // get rid of ttl internals
          sensorArr.push(JSON.parse(value));
        }
      });
      stream.on("close", () => {
        return resolve(sensorArr);
      });
      stream.on("error", err => {
        return reject(err);
      });
    });
  }
}
