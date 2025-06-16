import mongoose from 'mongoose';
import config from '../../config';
import logger from '../../utils/logger';

export const connectMongo = async (): Promise<void> => {
  // Early return if MongoDB is disabled
  if (!config.MONGO_ENABLED) {
    logger.info('MongoDB is disabled - skipping connection');
    return;
  }

  // Check for MongoDB URI
  if (!config.MONGO_URI) {
    logger.error('MongoDB URI is not defined');
    return;
  }

  try {
    await mongoose.connect(config.MONGO_URI);
    logger.info('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    logger.error('Continuing without MongoDB connection');
  }
}; 