import { IWriter } from "../interfaces/IWriter";
import { IReader } from "../interfaces/IReader";
export abstract class CQLRepository<T, PK> implements IWriter<T, PK>, IReader<T, PK> {
  protected readonly _keyspace: string;
  protected readonly _tablename: string;

  public abstract find(key: PK): Promise<T[]>;

  public abstract create(item: T): Promise<boolean>;

  public abstract exists(key: PK): Promise<boolean>;

  public abstract update(key: PK, item: Partial<T>): Promise<boolean>;

  public abstract delete(key: PK): Promise<boolean>;
}
