// Ensures required env variables exist during tests
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
process.env.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
process.env.CORS_METHODS = process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE';
process.env.CORS_CREDENTIALS = process.env.CORS_CREDENTIALS || 'false';
process.env.UPLOAD_PROVIDER = process.env.UPLOAD_PROVIDER || 'local';
process.env.UPLOAD_ALLOWED_TYPES = process.env.UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/png,application/pdf';
process.env.ENABLE_GRAPHQL = process.env.ENABLE_GRAPHQL || 'false';
process.env.ENABLE_SWAGGER = process.env.ENABLE_SWAGGER || 'false';
process.env.ENABLE_RATE_LIMIT = process.env.ENABLE_RATE_LIMIT || 'false';
process.env.MONGO_ENABLED = process.env.MONGO_ENABLED || 'false';
process.env.POSTGRES_ENABLED = process.env.POSTGRES_ENABLED || 'false';
process.env.MYSQL_ENABLED = process.env.MYSQL_ENABLED || 'false';
process.env.SQLSERVER_ENABLED = process.env.SQLSERVER_ENABLED || 'false';
process.env.REDIS_ENABLED = process.env.REDIS_ENABLED || 'false';
process.env.PORT = process.env.PORT || '0'; // let supertest bind ephemeral port


