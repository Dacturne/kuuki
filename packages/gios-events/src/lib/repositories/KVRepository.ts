import { IWriter } from "../interfaces/IWriter";
import { IReader } from "../interfaces/IReader";

export abstract class KVRepository<T, PK> implements IWriter<T, PK>, IReader<T, PK> {
  public abstract find(key: PK): Promise<T[]>;

  public abstract create(key: PK, item: T): Promise<boolean>;

  public abstract exists(key: PK): Promise<boolean>;

  public abstract update(key: PK, item: Partial<T>): Promise<boolean>;

  public abstract delete(key: PK): Promise<boolean>;
}
