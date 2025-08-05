import config from '../config';
import logger from '../utils/logger';

let pub: any = null;
let sub: any = null;

if (config.REDIS_ENABLED) {
  try {
    const Redis = require('ioredis');
    pub = new Redis({
      host: config.REDIS_HOST || 'localhost',
      port: config.REDIS_PORT || 6379,
      password: config.REDIS_PASSWORD || undefined,
    });
    sub = new Redis({
      host: config.REDIS_HOST || 'localhost',
      port: config.REDIS_PORT || 6379,
      password: config.REDIS_PASSWORD || undefined,
    });
    logger.info('Redis event bus clients initialized.');
    pub.on('error', (err: any) => logger.error('Redis pub connection error:', err));
    sub.on('error', (err: any) => logger.error('Redis sub connection error:', err));
  } catch (err) {
    logger.error('Failed to initialize Redis event bus clients:', err);
  }
} else {
  logger.info('Redis is disabled. No event bus clients initialized.');
}

/**
 * Publish an event to a channel
 */
export async function publish(channel: string, message: any) {
  if (!pub) return;
  const msg = typeof message === 'string' ? message : JSON.stringify(message);
  await pub.publish(channel, msg);
}

/**
 * Subscribe to a channel and handle messages
 */
export function subscribe(channel: string, handler: (msg: any) => void) {
  if (!sub) return;
  sub.subscribe(channel, (err: any, count: number) => {
    if (err) {
      logger.error('Redis subscribe error:', err);
      return;
    }
    logger.info(`Subscribed to Redis channel: ${channel}`);
  });
  sub.on('message', (chan: string, msg: string) => {
    if (chan === channel) {
      try {
        handler(JSON.parse(msg));
      } catch {
        handler(msg);
      }
    }
  });
} 