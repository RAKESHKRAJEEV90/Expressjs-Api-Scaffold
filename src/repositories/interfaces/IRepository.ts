export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  findOne(filter: Partial<T>): Promise<T | null>;
  find(filter: Partial<T>): Promise<T[]>;
  exists(filter: Partial<T>): Promise<boolean>;
  count(filter?: Partial<T>): Promise<number>;
} 