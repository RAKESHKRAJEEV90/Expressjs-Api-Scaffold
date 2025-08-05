import { SQLServerBaseRepository } from './BaseRepository';
import { ConnectionPool } from 'mssql';

// Example User type
export interface User {
  id: number;
  username: string;
  email: string;
}

/**
 * UserRepository for SQL Server, implements basic CRUD for 'users' table.
 */
export class SQLServerUserRepository extends SQLServerBaseRepository<User> {
  constructor(pool: ConnectionPool) {
    super(pool, 'users');
  }
} 