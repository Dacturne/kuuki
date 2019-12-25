import { IWriter } from "../interfaces/IWriter";
import { IReader } from "../interfaces/IReader";
export declare abstract class CQLRepository<T, PK> implements IWriter<T, PK>, IReader<T, PK> {
    protected readonly _keyspace: string;
    protected readonly _tablename: string;
    abstract find(key: PK): Promise<T[]>;
    abstract create(item: T): Promise<boolean>;
    abstract exists(key: PK): Promise<boolean>;
    abstract update(key: PK, item: Partial<T>): Promise<boolean>;
    abstract delete(key: PK): Promise<boolean>;
}
