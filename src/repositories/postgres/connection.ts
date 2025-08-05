import { Client } from 'pg';
import config from '../../config';
import logger from '../../utils/logger';

let client: Client | null = null;

/**
 * Initialize PostgreSQL connection if enabled in config.
 */
export async function connectPostgres() {
  if (!config.POSTGRES_ENABLED) {
    logger.info('PostgreSQL is disabled by config.');
    return null;
  }
  if (!config.POSTGRES_HOST || !config.POSTGRES_DB || !config.POSTGRES_USER || !config.POSTGRES_PASSWORD) {
    logger.warn('PostgreSQL config missing. Skipping connection.');
    return null;
  }
  if (client) return client;
  client = new Client({
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    database: config.POSTGRES_DB,
    user: config.POSTGRES_USER,
    password: config.POSTGRES_PASSWORD,
  });
  try {
    await client.connect();
    logger.info('Connected to PostgreSQL');
    return client;
  } catch (err) {
    logger.error('PostgreSQL connection error:', err);
    client = null;
    return null;
  }
}

export function getPostgresClient() {
  return client;
} 