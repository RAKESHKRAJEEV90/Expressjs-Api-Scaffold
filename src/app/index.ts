import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import config from '../config';
import logger, { stream } from '../utils/logger';
import { errorHandler } from '../middlewares/errorHandler';
import morgan from 'morgan';
import routes from '../routes';
import rateLimiter from '../middlewares/rateLimiter';
import { connectMongo } from '../repositories/mongo/connection';
import { setupGraphQL } from '../graphql';
import { setupSwagger } from '../utils/swagger';
import { metricsMiddleware } from '../middlewares/metrics';

// Import feature toggles
const {
  ENABLE_GRAPHQL,
  ENABLE_SWAGGER,
  ENABLE_RATE_LIMIT,
  MONGO_ENABLED,
  REDIS_ENABLED,
  SQLSERVER_ENABLED,
  POSTGRES_ENABLED,
  MYSQL_ENABLED,
} = config;

// Log initial configuration
logger.info('Initializing application with configuration:', {
  MONGO_ENABLED,
  POSTGRES_ENABLED,
  MYSQL_ENABLED,
  SQLSERVER_ENABLED,
  REDIS_ENABLED,
});

// Create and configure the Express app
const app: Application = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    methods: config.CORS_METHODS,
    credentials: config.CORS_CREDENTIALS,
  }),
);

// Enable compression
app.use(compression());

// Parse cookies
app.use(cookieParser());

// Parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev', { stream }));

// Rate limiter (conditionally enabled)
if (ENABLE_RATE_LIMIT && !REDIS_ENABLED) {
  logger.info('Using in-memory rate limiter (Redis is disabled)');
  app.use(rateLimiter);
}

// Connect to databases (conditionally enabled)
if (MONGO_ENABLED) {
  if (config.MONGO_URI) {
    connectMongo().catch((error) => {
      logger.error('Failed to connect to MongoDB:', error);
    });
  } else {
    logger.warn('MongoDB is enabled but MONGO_URI is not defined');
  }
} else {
  logger.info('MongoDB is disabled - skipping connection');
}

// PostgreSQL connection
if (POSTGRES_ENABLED) {
  import('../repositories/postgres/connection').then(({ connectPostgres }) => {
    connectPostgres().catch((error: any) => {
      logger.error('Failed to connect to PostgreSQL:', error);
    });
  });
} else {
  logger.info('PostgreSQL is disabled - skipping connection');
}

// MySQL connection
if (MYSQL_ENABLED) {
  import('../repositories/mysql/connection').then(({ connectMySQL }) => {
    connectMySQL().catch((error: any) => {
      logger.error('Failed to connect to MySQL:', error);
    });
  });
} else {
  logger.info('MySQL is disabled - skipping connection');
}

// SQL Server connection
if (SQLSERVER_ENABLED) {
  import('../repositories/sqlserver/connection').then(({ connectSQLServer }) => {
    connectSQLServer().catch((error: any) => {
      logger.error('Failed to connect to SQL Server:', error);
    });
  });
} else {
  logger.info('SQL Server is disabled - skipping connection');
}

// Health check endpoints (root level)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

app.get('/ready', (req, res) => {
  const services = {
    mongodb: MONGO_ENABLED ? 'UP' : 'DISABLED',
    postgres: POSTGRES_ENABLED ? 'UP' : 'DISABLED',
    mysql: MYSQL_ENABLED ? 'UP' : 'DISABLED',
    sqlserver: SQLSERVER_ENABLED ? 'UP' : 'DISABLED',
    redis: REDIS_ENABLED ? 'UP' : 'DISABLED',
  };

  logger.debug('Service status:', services);

  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    services,
  });
});

// REST API routes (versioned)
app.use('/api', routes);

// GraphQL (conditionally enabled)
if (ENABLE_GRAPHQL) setupGraphQL(app);

// Swagger docs (conditionally enabled)
if (ENABLE_SWAGGER) setupSwagger(app);

// Metrics endpoint
app.get('/metrics', metricsMiddleware);

// Apply error handling middleware
app.use(errorHandler);

export default app; 