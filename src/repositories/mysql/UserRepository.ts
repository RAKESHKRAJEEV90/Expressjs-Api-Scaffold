import { MySQLBaseRepository } from './BaseRepository';
import { Connection } from 'mysql2/promise';

// Example User type
export interface User {
  id: number;
  username: string;
  email: string;
}

/**
 * UserRepository for MySQL, implements basic CRUD for 'users' table.
 */
export class MySQLUserRepository extends MySQLBaseRepository<User> {
  constructor(connection: Connection) {
    super(connection, 'users');
  }
} 