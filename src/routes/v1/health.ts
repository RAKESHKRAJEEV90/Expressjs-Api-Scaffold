import { Router } from 'express';
import config from '../../config';

const router = Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

// Readiness check endpoint
router.get('/ready', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: config.MONGO_ENABLED ? 'UP' : 'DISABLED',
      postgres: config.POSTGRES_ENABLED ? 'UP' : 'DISABLED',
      mysql: config.MYSQL_ENABLED ? 'UP' : 'DISABLED',
      sqlserver: config.SQLSERVER_ENABLED ? 'UP' : 'DISABLED',
      redis: config.REDIS_ENABLED ? 'UP' : 'DISABLED',
    },
  });
});

export default router; 