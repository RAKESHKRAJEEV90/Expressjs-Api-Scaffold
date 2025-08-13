import { Router } from 'express';
import config from '../config';
import logger from '../utils/logger';
import v1Router from './v1';

const router = Router();

// Health check endpoints (root level)
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

router.get('/ready', (req, res) => {
  // Debug log the actual values
  logger.debug('Environment variables:', {
    MONGO_ENABLED: config.MONGO_ENABLED,
    POSTGRES_ENABLED: config.POSTGRES_ENABLED,
    MYSQL_ENABLED: config.MYSQL_ENABLED,
    SQLSERVER_ENABLED: config.SQLSERVER_ENABLED,
    REDIS_ENABLED: config.REDIS_ENABLED,
  });

  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: config.MONGO_ENABLED === true ? 'UP' : 'DISABLED',
      postgres: config.POSTGRES_ENABLED === true ? 'UP' : 'DISABLED',
      mysql: config.MYSQL_ENABLED === true ? 'UP' : 'DISABLED',
      sqlserver: config.SQLSERVER_ENABLED === true ? 'UP' : 'DISABLED',
      redis: config.REDIS_ENABLED === true ? 'UP' : 'DISABLED',
    },
  });
});

// Mount v1 routes explicitly to avoid dynamic resolution issues in tests
router.use('/v1', v1Router);

export default router; 