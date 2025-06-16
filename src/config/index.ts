import dotenv from 'dotenv';
import { z } from 'zod';
import { loadEnv } from '../utils/env';
import logger from '../utils/logger';

// Load environment variables
loadEnv();

// Helper function to parse boolean values
function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  const cleanValue = value.trim().toLowerCase();
  logger.debug(`Parsing boolean value: "${value}" -> ${cleanValue === 'true'}`);
  return cleanValue === 'true';
}

// Configuration schema
const configSchema = z.object({
  // Server configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  API_VERSION: z.string().default('v1'),

  // Feature flags
  ENABLE_GRAPHQL: z.string().transform(parseBoolean).default('false'),
  ENABLE_SWAGGER: z.string().transform(parseBoolean).default('false'),
  ENABLE_RATE_LIMIT: z.string().transform(parseBoolean).default('false'),

  // Database configuration
  MONGO_ENABLED: z.string().transform(parseBoolean).default('false'),
  MONGO_URI: z.string().optional(),

  POSTGRES_ENABLED: z.string().transform(parseBoolean).default('false'),
  POSTGRES_HOST: z.string().optional(),
  POSTGRES_PORT: z.string().transform(Number).optional(),
  POSTGRES_DB: z.string().optional(),
  POSTGRES_USER: z.string().optional(),
  POSTGRES_PASSWORD: z.string().optional(),

  MYSQL_ENABLED: z.string().transform(parseBoolean).default('false'),
  MYSQL_HOST: z.string().optional(),
  MYSQL_PORT: z.string().transform(Number).optional(),
  MYSQL_DB: z.string().optional(),
  MYSQL_USER: z.string().optional(),
  MYSQL_PASSWORD: z.string().optional(),

  SQLSERVER_ENABLED: z.string().transform(parseBoolean).default('false'),
  SQLSERVER_HOST: z.string().optional(),
  SQLSERVER_PORT: z.string().transform(Number).optional(),
  SQLSERVER_DB: z.string().optional(),
  SQLSERVER_USER: z.string().optional(),
  SQLSERVER_PASSWORD: z.string().optional(),

  REDIS_ENABLED: z.string().transform(parseBoolean).default('false'),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().transform(Number).optional(),
  REDIS_PASSWORD: z.string().optional(),

  // JWT configuration
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),

  // File upload configuration
  UPLOAD_PROVIDER: z.enum(['local', 's3']).default('local'),
  UPLOAD_MAX_SIZE: z.string().transform(Number).default('5242880'),
  UPLOAD_ALLOWED_TYPES: z.string(),

  // AWS S3 configuration
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_BUCKET_NAME: z.string().optional(),

  // Logging configuration
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_FORMAT: z.enum(['pretty', 'json']).default('pretty'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),

  // CORS configuration
  CORS_ORIGIN: z.string().default('*'),
  CORS_METHODS: z.string().default('GET,HEAD,PUT,PATCH,POST,DELETE'),
  CORS_CREDENTIALS: z.string().transform(parseBoolean).default('true'),

  // Health check settings
  HEALTH_CHECK_INTERVAL: z.string().transform(Number).default('30000'),
});

// Parse and validate configuration
const config = configSchema.parse(process.env);

// Log the final parsed configuration
logger.debug('Final parsed configuration:', {
  MONGO_ENABLED: config.MONGO_ENABLED,
  POSTGRES_ENABLED: config.POSTGRES_ENABLED,
  MYSQL_ENABLED: config.MYSQL_ENABLED,
  SQLSERVER_ENABLED: config.SQLSERVER_ENABLED,
  REDIS_ENABLED: config.REDIS_ENABLED
});

export default config; 