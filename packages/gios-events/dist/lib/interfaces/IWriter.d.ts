export interface IWriter<T, PK> {
    create(key: PK, item: T): Promise<boolean>;
    update(key: PK, item: Partial<T>): Promise<boolean>;
    delete(key: PK): Promise<boolean>;
}
