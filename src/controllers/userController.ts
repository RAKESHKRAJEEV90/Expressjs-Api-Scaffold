import { Request, Response } from 'express';
import { emitUserCreatedEvent } from '../events/UserCreatedEvent';

/**
 * Sample controller to create a user and emit UserCreatedEvent
 */
export async function createUser(req: Request, res: Response) {
  // Mock user creation (replace with real DB logic)
  const user = {
    id: Date.now(),
    username: req.body.username,
    email: req.body.email,
  };

  // Emit the event
  emitUserCreatedEvent(user);

  res.status(201).json({ message: 'User created', user });
} 