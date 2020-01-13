import { IWriter } from "../interfaces/IWriter";
import { IReader } from "../interfaces/IReader";
export declare abstract class KVRepository<T, PK> implements IWriter<T, PK>, IReader<T, PK> {
    abstract find(key: PK): Promise<T[]>;
    abstract create(key: PK, item: T): Promise<boolean>;
    abstract exists(key: PK): Promise<boolean>;
    abstract update(key: PK, item: Partial<T>): Promise<boolean>;
    abstract delete(key: PK): Promise<boolean>;
}
