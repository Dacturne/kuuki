import { MeasurementPartitioningKey } from "../models/MeasurementPartitioningKey";
import { KVRepository } from "./KVRepository";
import { MeasurementRaw } from "@kuuki/luftdaten/dist/lib/models/MeasurementRaw";
import levelup from "levelup";
import leveldown from "leveldown";
import ttl from "level-ttl";

export class MeasurementRepository extends KVRepository<
  MeasurementRaw,
  MeasurementPartitioningKey
> {
  private _db: ttl.LevelTTL;

  constructor() {
    super();
    const db = leveldown("./db");
    this._db = ttl(levelup(db));
  }

  public async find(key: MeasurementPartitioningKey): Promise<MeasurementRaw[]> {
    try {
      const response = await this._db.get(JSON.stringify(key));
      return Promise.resolve([response]);
    } catch(error) {
      return Promise.reject(error);
    }
  }

  public async create(key: MeasurementPartitioningKey, item: MeasurementRaw): Promise<boolean> {
    try {
      await this._db.put(
        JSON.stringify(key),
        JSON.stringify(item), {
          ttl: 1000 * 60 * 10
        }
      );
      return Promise.resolve(true);
    } catch(error) {
      return Promise.reject(error);
    }
  }

  public async exists(key: MeasurementPartitioningKey): Promise<boolean> {
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
    key: MeasurementPartitioningKey,
    item: Partial<MeasurementRaw>
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public delete(key: MeasurementPartitioningKey): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
