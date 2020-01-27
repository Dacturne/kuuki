import { KVRepository } from "./KVRepository";
import ttl from "level-ttl";
import { Measurement } from "../models/Measurement";
export declare type MeasurementPartitioningKey = {
    sensorId: number;
    dateTime: string;
};
export declare class MeasurementRepository extends KVRepository<Measurement, MeasurementPartitioningKey> {
    private _db;
    constructor(_db?: ttl.LevelTTL);
    find(key: MeasurementPartitioningKey): Promise<Measurement[]>;
    create(key: MeasurementPartitioningKey, item: Measurement): Promise<boolean>;
    exists(key: MeasurementPartitioningKey): Promise<boolean>;
    update(key: MeasurementPartitioningKey, item: Partial<Measurement>): Promise<boolean>;
    delete(key: MeasurementPartitioningKey): Promise<boolean>;
}
