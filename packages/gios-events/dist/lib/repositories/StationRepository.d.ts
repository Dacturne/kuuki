import { KVRepository } from "./KVRepository";
import ttl from "level-ttl";
import { MeasurementStationRaw } from "@kuuki/gios/dist/lib/models/MeasurementStationRaw";
declare type MeasurementStationPartitioningKey = {
    identifier: number;
};
export declare class StationRepository extends KVRepository<MeasurementStationRaw, MeasurementStationPartitioningKey> {
    private _db;
    constructor(_db?: ttl.LevelTTL);
    find(key: MeasurementStationPartitioningKey): Promise<MeasurementStationRaw[]>;
    create(key: MeasurementStationPartitioningKey, item: MeasurementStationRaw): Promise<boolean>;
    exists(key: MeasurementStationPartitioningKey): Promise<boolean>;
    update(key: MeasurementStationPartitioningKey, item: Partial<MeasurementStationRaw>): Promise<boolean>;
    delete(key: MeasurementStationPartitioningKey): Promise<boolean>;
    getAll(): Promise<MeasurementStationRaw[]>;
}
export {};
