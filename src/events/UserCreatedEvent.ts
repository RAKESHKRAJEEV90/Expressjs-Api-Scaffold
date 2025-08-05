import config from '../config';
import { publish as redisPublish, subscribe as redisSubscribe } from './RedisEventBus';
import EventEmitter from 'events';

// In-memory event emitter fallback
const emitter = new EventEmitter();

const EVENT_NAME = 'user:created';

/**
 * Emit a UserCreatedEvent (uses Redis pub/sub if enabled, otherwise in-memory)
 */
export function emitUserCreatedEvent(user: any) {
  if (config.REDIS_ENABLED) {
    redisPublish(EVENT_NAME, user);
  } else {
    emitter.emit(EVENT_NAME, user);
  }
}

/**
 * Subscribe to UserCreatedEvent (uses Redis pub/sub if enabled, otherwise in-memory)
 */
export function onUserCreated(handler: (user: any) => void) {
  if (config.REDIS_ENABLED) {
    redisSubscribe(EVENT_NAME, handler);
  } else {
    emitter.on(EVENT_NAME, handler);
  }
} 