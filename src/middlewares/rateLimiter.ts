import rateLimit from 'express-rate-limit';
import config from '../config';

const rateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Use in-memory store by default
  store: undefined
});

export default rateLimiter;