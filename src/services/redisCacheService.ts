import config from '../config';
import logger from '../utils/logger';

let redisClient: any = null;

// Test helper to inject a mock Redis client
export function __setRedisClient(client: any) {
  redisClient = client;
}

// Expose a test-only hook to inject a mock Redis client
export function __setRedisClientForTests(client: any) {
  redisClient = client;
}

if (config.REDIS_ENABLED) {
  try {
    const Redis = require('ioredis');
    redisClient = new Redis({
      host: config.REDIS_HOST || 'localhost',
      port: config.REDIS_PORT || 6379,
      password: config.REDIS_PASSWORD || undefined,
    });
    logger.info('Redis cache client initialized.');
    redisClient.on('error', (err: any) => {
      logger.error('Redis cache connection error:', err);
    });
  } catch (err) {
    logger.error('Failed to initialize Redis cache client:', err);
  }
} else {
  logger.info('Redis is disabled. No cache client initialized.');
}

/**
 * Set a value in Redis cache
 */
export async function cacheSet(key: string, value: any, ttlSeconds?: number) {
  if (!redisClient) return;
  const val = typeof value === 'string' ? value : JSON.stringify(value);
  if (ttlSeconds) {
    await redisClient.set(key, val, 'EX', ttlSeconds);
  } else {
    await redisClient.set(key, val);
  }
}

/**
 * Get a value from Redis cache
 */
export async function cacheGet(key: string) {
  if (!redisClient) return null;
  const val = await redisClient.get(key);
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
}

/**
 * Delete a value from Redis cache
 */
export async function cacheDel(key: string) {
  if (!redisClient) return;
  await redisClient.del(key);
} 