import { ConnectionPool } from 'mssql';

export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<boolean>;
}

export class SQLServerBaseRepository<T> implements IRepository<T> {
  protected pool: ConnectionPool;
  protected table: string;

  constructor(pool: ConnectionPool, table: string) {
    this.pool = pool;
    this.table = table;
  }

  async findAll(): Promise<T[]> {
    const result = await this.pool.request().query(`SELECT * FROM [${this.table}]`);
    return result.recordset;
  }

  async findById(id: string | number): Promise<T | null> {
    const result = await this.pool.request().query(`SELECT * FROM [${this.table}] WHERE id = @id`, { id });
    return result.recordset[0] || null;
  }

  async create(data: Partial<T>): Promise<T> {
    throw new Error('Not implemented: create');
  }

  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    throw new Error('Not implemented: update');
  }

  async delete(id: string | number): Promise<boolean> {
    const result = await this.pool.request().query(`DELETE FROM [${this.table}] WHERE id = @id`, { id });
    return result.rowsAffected[0] > 0;
  }
} 