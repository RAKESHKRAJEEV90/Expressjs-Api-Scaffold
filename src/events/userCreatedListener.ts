import { onUserCreated } from './UserCreatedEvent';

// Register a listener for UserCreatedEvent
onUserCreated((user) => {
  console.log('UserCreatedEvent received:', user);
  // Add additional logic here (e.g., send welcome email)
}); 