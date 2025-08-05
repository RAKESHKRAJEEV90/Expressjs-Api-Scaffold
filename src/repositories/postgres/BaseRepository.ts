import { Client } from 'pg';

export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<boolean>;
}

export class PostgresBaseRepository<T> implements IRepository<T> {
  protected client: Client;
  protected table: string;

  constructor(client: Client, table: string) {
    this.client = client;
    this.table = table;
  }

  async findAll(): Promise<T[]> {
    const res = await this.client.query(`SELECT * FROM ${this.table}`);
    return res.rows;
  }

  async findById(id: string | number): Promise<T | null> {
    const res = await this.client.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id]);
    return res.rows[0] || null;
  }

  async create(data: Partial<T>): Promise<T> {
    // This is a generic example; in real use, you'd want to dynamically build columns/values
    throw new Error('Not implemented: create');
  }

  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    throw new Error('Not implemented: update');
  }

  async delete(id: string | number): Promise<boolean> {
    const res = await this.client.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
    return res.rowCount > 0;
  }
} 