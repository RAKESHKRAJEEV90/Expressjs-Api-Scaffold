import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import config from '../config';
import logger from '../utils/logger';

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

// Dynamically load all versioned route folders (e.g., v1, v2)
const routesDir = path.join(__dirname);
const versions = fs.readdirSync(routesDir).filter((file) =>
  fs.statSync(path.join(routesDir, file)).isDirectory() && file.startsWith('v'),
);

// Mount versioned routes under /api
versions.forEach((version) => {
  const versionRouter = require(path.join(routesDir, version)).default;
  router.use(`/api/${version}`, versionRouter);
});

export default router; 