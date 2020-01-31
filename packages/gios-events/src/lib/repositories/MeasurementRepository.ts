import { KVRepository } from "./KVRepository";
import levelup from "levelup";
import leveldown from "leveldown";
import ttl from "level-ttl";
import { Measurement } from "../models/Measurement";

/**
 * Warning: Preserve the order of properties to maintain a searchable key
 */
export type MeasurementPartitioningKey = {
  sensorId: number,
  dateTime: string,
}

export class MeasurementRepository extends KVRepository<
  Measurement,
  MeasurementPartitioningKey
> {
  constructor(private _db: ttl.LevelTTL = ttl(levelup(leveldown("./db")))) {
    super();
  }

  public async find(key: MeasurementPartitioningKey): Promise<Measurement[]> {
    try {
      const response = await this._db.get(
        JSON.stringify({
          sensorId: key.sensorId,
          dateTime: key.dateTime
        })
      );
      return Promise.resolve([JSON.parse(response)]);
    } catch(error) {
      return Promise.reject(error);
    }
  }

  public async create(key: MeasurementPartitioningKey, item: Measurement): Promise<boolean> {
    try {
      await this._db.put(
        JSON.stringify({
          sensorId: key.sensorId,
          dateTime: key.dateTime
        }),
        JSON.stringify(item), {
          ttl: 1000 * 60 * 60 * 73
        }
      );
      return Promise.resolve(true);
    } catch(error) {
      return Promise.reject(error);
    }
  }

  public async exists(key: MeasurementPartitioningKey): Promise<boolean> {
    try {
      await this._db.get(
        JSON.stringify({
          sensorId: key.sensorId,
          dateTime: key.dateTime
        })
      );
      return Promise.resolve(true);
    } catch(error) {
      if (error.notFound) {
        return Promise.resolve(false);
      }
      return Promise.reject(error);
    }
  }

  public update(
    key: MeasurementPartitioningKey,
    item: Partial<Measurement>
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public delete(key: MeasurementPartitioningKey): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

}
