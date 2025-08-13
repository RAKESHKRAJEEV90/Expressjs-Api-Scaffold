import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level based on environment
const level = () => {
  const explicit = process.env.LOG_LEVEL as keyof typeof levels | undefined;
  if (explicit && levels[explicit] !== undefined) return explicit;
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Define formats
const prettyFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Read log rotation settings from env
const logDirectory = process.env.LOG_DIR || 'logs';
const logDatePattern = process.env.LOG_DATE_PATTERN || 'YYYY-MM-DD';
const logMaxSize = process.env.LOG_MAX_SIZE || '20m';
const logRetentionDays = process.env.LOG_RETENTION_DAYS || '3d';
const logZipArchive = (process.env.LOG_ZIP_ARCHIVE || 'true').toLowerCase() === 'true';

// Ensure log directory exists
const resolvedLogDir = path.resolve(process.cwd(), logDirectory);
if (!fs.existsSync(resolvedLogDir)) {
  fs.mkdirSync(resolvedLogDir, { recursive: true });
}

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format: (process.env.LOG_FORMAT || 'pretty') === 'json' ? jsonFormat : prettyFormat,
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      dirname: resolvedLogDir,
      filename: 'error-%DATE%.log',
      datePattern: logDatePattern,
      zippedArchive: logZipArchive,
      maxSize: logMaxSize,
      maxFiles: logRetentionDays,
      level: 'error',
    }),
    new DailyRotateFile({
      dirname: resolvedLogDir,
      filename: 'combined-%DATE%.log',
      datePattern: logDatePattern,
      zippedArchive: logZipArchive,
      maxSize: logMaxSize,
      maxFiles: logRetentionDays,
      level: 'info',
    }),
  ],
});

// Create a stream object for Morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger; 