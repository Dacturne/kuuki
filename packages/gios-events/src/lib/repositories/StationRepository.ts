import { KVRepository } from "./KVRepository";
import levelup from "levelup";
import leveldown from "leveldown";
import ttl from "level-ttl";
import { MeasurementStationRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationRaw";

type MeasurementStationPartitioningKey = {
  identifier: number
}

export class StationRepository extends KVRepository<
  MeasurementStationRaw,
  MeasurementStationPartitioningKey
> {
  constructor(private _db: ttl.LevelTTL = ttl(levelup(leveldown("./db")))) {
    super();
  }

  public async find(key: MeasurementStationPartitioningKey): Promise<MeasurementStationRaw[]> {
    try {
      const response = await this._db.get(JSON.stringify(key));
      return Promise.resolve([JSON.parse(response)]);
    } catch(error) {
      return Promise.reject(error);
    }
  }

  public async create(key: MeasurementStationPartitioningKey, item: MeasurementStationRaw): Promise<boolean> {
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

  public async exists(key: MeasurementStationPartitioningKey): Promise<boolean> {
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
    key: MeasurementStationPartitioningKey,
    item: Partial<MeasurementStationRaw>
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public delete(key: MeasurementStationPartitioningKey): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public getAll(): Promise<MeasurementStationRaw[]> {
    return new Promise((resolve, reject) => {
      const stationArr = new Array<MeasurementStationRaw>();
      const stream = this._db.createReadStream({
        valueAsBuffer: false,
        keyAsBuffer: false
      });
      stream.on("data", ({ key, value }) => {
        if (!key.match("!ttl!")) { // get rid of ttl internals
          stationArr.push(JSON.parse(value));
        }
      });
      stream.on("close", () => {
        return resolve(stationArr);
      });
      stream.on("error", err => {
        return reject(err);
      });
    });
  }
}
