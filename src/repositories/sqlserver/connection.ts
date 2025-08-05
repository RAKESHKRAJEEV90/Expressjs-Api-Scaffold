import sql from 'mssql';
import config from '../../config';
import logger from '../../utils/logger';

let pool: sql.ConnectionPool | null = null;

/**
 * Initialize SQL Server connection if enabled in config.
 */
export async function connectSQLServer() {
  if (!config.SQLSERVER_ENABLED) {
    logger.info('SQL Server is disabled by config.');
    return null;
  }
  if (!config.SQLSERVER_HOST || !config.SQLSERVER_DB || !config.SQLSERVER_USER || !config.SQLSERVER_PASSWORD) {
    logger.warn('SQL Server config missing. Skipping connection.');
    return null;
  }
  if (pool) return pool;
  try {
    pool = await sql.connect({
      server: config.SQLSERVER_HOST,
      port: config.SQLSERVER_PORT,
      database: config.SQLSERVER_DB,
      user: config.SQLSERVER_USER,
      password: config.SQLSERVER_PASSWORD,
      options: { encrypt: false },
    });
    logger.info('Connected to SQL Server');
    return pool;
  } catch (err) {
    logger.error('SQL Server connection error:', err);
    pool = null;
    return null;
  }
}

export function getSQLServerPool() {
  return pool;
} 