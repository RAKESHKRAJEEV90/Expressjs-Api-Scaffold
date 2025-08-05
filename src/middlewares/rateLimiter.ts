import rateLimit from 'express-rate-limit';
import config from '../config';
import logger from '../utils/logger';

// Redis is currently only used for rate limiting in this scaffold.
let store: any = undefined;

if (config.REDIS_ENABLED) {
  logger.info('Redis is enabled. Attempting to use Redis for rate limiting...');
  try {
    const RedisStore = require('rate-limit-redis').default;
    const Redis = require('ioredis');
    const redisClient = new Redis({
      host: config.REDIS_HOST || 'localhost',
      port: config.REDIS_PORT || 6379,
      password: config.REDIS_PASSWORD || undefined,
    });
    store = new RedisStore({
      sendCommand: (...args: string[]) => redisClient.call(...args),
    });
    logger.info('Redis rate limiter store initialized.');
    redisClient.on('error', (err: any) => {
      logger.error('Redis connection error:', err);
    });
  } catch (err) {
    logger.error('Failed to initialize Redis rate limiter store:', err);
  }
} else {
  logger.info('Redis is disabled. Using in-memory rate limiter.');
}

const rateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  store,
});

export default rateLimiter;