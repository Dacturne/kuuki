import { MeasurementPartitioningKey } from "../models/MeasurementPartitioningKey";
import { MeasurementRowData } from "../models/MeasurementRowData";
import { CQLRepository } from "./CQLRepository";
export declare class MeasurementRepository extends CQLRepository<MeasurementRowData, MeasurementPartitioningKey> {
    constructor(dbClient: any);
    find(key: MeasurementPartitioningKey): Promise<MeasurementRowData[]>;
    create(item: MeasurementRowData): Promise<boolean>;
    exists(key: MeasurementPartitioningKey): Promise<boolean>;
    update(key: MeasurementPartitioningKey, item: Partial<MeasurementRowData>): Promise<boolean>;
    delete(key: MeasurementPartitioningKey): Promise<boolean>;
}
