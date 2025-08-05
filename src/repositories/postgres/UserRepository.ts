import { PostgresBaseRepository } from './BaseRepository';
import { Client } from 'pg';

// Example User type
export interface User {
  id: number;
  username: string;
  email: string;
}

/**
 * UserRepository for PostgreSQL, implements basic CRUD for 'users' table.
 */
export class PostgresUserRepository extends PostgresBaseRepository<User> {
  constructor(client: Client) {
    super(client, 'users');
  }
} 