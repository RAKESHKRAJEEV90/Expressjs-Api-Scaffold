import mysql from 'mysql2/promise';
import config from '../../config';
import logger from '../../utils/logger';

let connection: mysql.Connection | null = null;

/**
 * Initialize MySQL connection if enabled in config.
 */
export async function connectMySQL() {
  if (!config.MYSQL_ENABLED) {
    logger.info('MySQL is disabled by config.');
    return null;
  }
  if (!config.MYSQL_HOST || !config.MYSQL_DB || !config.MYSQL_USER || !config.MYSQL_PASSWORD) {
    logger.warn('MySQL config missing. Skipping connection.');
    return null;
  }
  if (connection) return connection;
  try {
    connection = await mysql.createConnection({
      host: config.MYSQL_HOST,
      port: config.MYSQL_PORT,
      database: config.MYSQL_DB,
      user: config.MYSQL_USER,
      password: config.MYSQL_PASSWORD,
    });
    logger.info('Connected to MySQL');
    return connection;
  } catch (err) {
    logger.error('MySQL connection error:', err);
    connection = null;
    return null;
  }
}

export function getMySQLConnection() {
  return connection;
} 