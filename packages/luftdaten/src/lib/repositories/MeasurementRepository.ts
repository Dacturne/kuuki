import { MeasurementPartitioningKey } from "../models/MeasurementPartitioningKey";
import { MeasurementRowData } from "../models/MeasurementRowData";
import { CQLRepository } from "./CQLRepository";

export class MeasurementRepository extends CQLRepository<
  MeasurementRowData,
  MeasurementPartitioningKey
> {
  constructor(dbClient: any) {
    super();
  }

  public find(key: MeasurementPartitioningKey): Promise<MeasurementRowData[]> {
    throw new Error("Method not implemented.");
  }

  public create(item: MeasurementRowData): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public exists(key: MeasurementPartitioningKey): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public update(
    key: MeasurementPartitioningKey,
    item: Partial<MeasurementRowData>
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  public delete(key: MeasurementPartitioningKey): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
