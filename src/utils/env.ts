import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

export function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    console.warn('No .env file found');
    return;
  }

  // Clear require cache for dotenv and related modules
  delete require.cache[require.resolve('dotenv')];
  delete require.cache[require.resolve('dotenv/config')];

  // Delete specific database-related env vars to ensure fresh loading
  delete process.env.MONGO_ENABLED;
  delete process.env.POSTGRES_ENABLED;
  delete process.env.MYSQL_ENABLED;
  delete process.env.SQLSERVER_ENABLED;
  delete process.env.REDIS_ENABLED;

  // Read and parse .env file manually to handle comments
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envLines = envContent.split('\n');
  
  const cleanEnvVars: Record<string, string> = {};
  
  envLines.forEach(line => {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) return;
    
    // Split by first equals sign to handle values that might contain equals
    const equalIndex = line.indexOf('=');
    if (equalIndex === -1) return;
    
    const key = line.substring(0, equalIndex).trim();
    // Get everything after the equals sign, but before any comment
    let value = line.substring(equalIndex + 1).trim();
    const commentIndex = value.indexOf('#');
    if (commentIndex !== -1) {
      value = value.substring(0, commentIndex).trim();
    }
    
    // Handle boolean values
    if (key.endsWith('_ENABLED')) {
      value = value.toLowerCase() === 'true' ? 'true' : 'false';
    }
    
    if (key && value) {
      cleanEnvVars[key] = value;
      process.env[key] = value;
    }
  });

  if (process.env.NODE_ENV !== 'test') {
    // Log raw environment variables for debugging
    console.log('Raw environment variables:', {
      MONGO_ENABLED: process.env.MONGO_ENABLED,
      POSTGRES_ENABLED: process.env.POSTGRES_ENABLED,
      MYSQL_ENABLED: process.env.MYSQL_ENABLED,
      SQLSERVER_ENABLED: process.env.SQLSERVER_ENABLED,
      REDIS_ENABLED: process.env.REDIS_ENABLED
    });

    // Log cleaned environment variables
    console.log('Cleaned environment variables:', cleanEnvVars);
  }
} 