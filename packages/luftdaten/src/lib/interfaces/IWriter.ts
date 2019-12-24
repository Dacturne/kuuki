export interface IWriter<T, PK> {
  create(item: T): Promise<boolean>;
  update(key: PK, item: Partial<T>): Promise<boolean>;
  delete(key: PK): Promise<boolean>;
}
