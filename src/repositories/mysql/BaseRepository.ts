import { Connection } from 'mysql2/promise';

export interface IRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: string | number): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string | number, data: Partial<T>): Promise<T | null>;
  delete(id: string | number): Promise<boolean>;
}

export class MySQLBaseRepository<T> implements IRepository<T> {
  protected connection: Connection;
  protected table: string;

  constructor(connection: Connection, table: string) {
    this.connection = connection;
    this.table = table;
  }

  async findAll(): Promise<T[]> {
    const [rows] = await this.connection.query(`SELECT * FROM \`${this.table}\``);
    return rows as T[];
  }

  async findById(id: string | number): Promise<T | null> {
    const [rows] = await this.connection.query(`SELECT * FROM \`${this.table}\` WHERE id = ?`, [id]);
    return (rows as T[])[0] || null;
  }

  async create(data: Partial<T>): Promise<T> {
    throw new Error('Not implemented: create');
  }

  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    throw new Error('Not implemented: update');
  }

  async delete(id: string | number): Promise<boolean> {
    const [result]: any = await this.connection.query(`DELETE FROM \`${this.table}\` WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
} 