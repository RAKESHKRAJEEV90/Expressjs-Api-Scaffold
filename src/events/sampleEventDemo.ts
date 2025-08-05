import { publish, subscribe } from './RedisEventBus';

// Subscribe to 'user:created' events
subscribe('user:created', (msg) => {
  console.log('Received user:created event:', msg);
});

// Example: publish a 'user:created' event
export function emitUserCreatedEvent(user: any) {
  publish('user:created', user);
} 