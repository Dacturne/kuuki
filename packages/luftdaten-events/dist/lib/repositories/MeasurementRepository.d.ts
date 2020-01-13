import { MeasurementPartitioningKey } from "../models/MeasurementPartitioningKey";
import { KVRepository } from "./KVRepository";
import { MeasurementRaw } from "@kuuki/luftdaten/dist/lib/models/MeasurementRaw";
export declare class MeasurementRepository extends KVRepository<MeasurementRaw, MeasurementPartitioningKey> {
    private _db;
    constructor();
    find(key: MeasurementPartitioningKey): Promise<MeasurementRaw[]>;
    create(key: MeasurementPartitioningKey, item: MeasurementRaw): Promise<boolean>;
    exists(key: MeasurementPartitioningKey): Promise<boolean>;
    update(key: MeasurementPartitioningKey, item: Partial<MeasurementRaw>): Promise<boolean>;
    delete(key: MeasurementPartitioningKey): Promise<boolean>;
}
