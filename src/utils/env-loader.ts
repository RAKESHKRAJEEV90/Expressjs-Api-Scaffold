import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import logger from './logger';

export function loadEnvironmentVariables() {
  const envPath = path.resolve(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    logger.warn('No .env file found');
    return;
  }

  // Read the .env file
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  // Split into lines and process each line
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) return;
    
    // Find the first equals sign
    const equalIndex = line.indexOf('=');
    if (equalIndex === -1) return;
    
    // Extract key and value
    const key = line.substring(0, equalIndex).trim();
    let value = line.substring(equalIndex + 1).trim();
    
    // Remove any trailing comments
    const commentIndex = value.indexOf('#');
    if (commentIndex !== -1) {
      value = value.substring(0, commentIndex).trim();
    }
    
    // Set the environment variable
    if (key && value) {
      process.env[key] = value;
    }
  });

  // Log the current state of database-related variables
  logger.debug('Environment variables after loading:', {
    MONGO_ENABLED: process.env.MONGO_ENABLED,
    POSTGRES_ENABLED: process.env.POSTGRES_ENABLED,
    MYSQL_ENABLED: process.env.MYSQL_ENABLED,
    SQLSERVER_ENABLED: process.env.SQLSERVER_ENABLED,
    REDIS_ENABLED: process.env.REDIS_ENABLED
  });
} 