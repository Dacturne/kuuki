export interface IReader<T, PK> {
  find(key: PK): Promise<T[]>;
  exists(key: PK): Promise<boolean>;
}
