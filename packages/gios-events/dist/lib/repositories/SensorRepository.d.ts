import { KVRepository } from "./KVRepository";
import ttl from "level-ttl";
import { MeasurementStationSensorRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationSensorRaw";
declare type SensorPartitioningKey = {
    identifier: number;
};
export declare class SensorRepository extends KVRepository<MeasurementStationSensorRaw, SensorPartitioningKey> {
    private _db;
    constructor(_db?: ttl.LevelTTL);
    find(key: SensorPartitioningKey): Promise<MeasurementStationSensorRaw[]>;
    create(key: SensorPartitioningKey, item: MeasurementStationSensorRaw): Promise<boolean>;
    exists(key: SensorPartitioningKey): Promise<boolean>;
    update(key: SensorPartitioningKey, item: Partial<MeasurementStationSensorRaw>): Promise<boolean>;
    delete(key: SensorPartitioningKey): Promise<boolean>;
    getAll(): Promise<MeasurementStationSensorRaw[]>;
}
export {};
