import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';
import config from '../config';

interface ErrorResponse {
  status: string;
  message: string;
  stack?: string;
  errors?: any[];
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`${err.name}: ${err.message}`);
  logger.error(err.stack);

  // Handle specific error types
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Handle Mongoose errors
  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    error = new AppError(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors)
      .map((val: any) => val.message)
      .join(', ');
    error = new AppError(message, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again.', 401);
  }

  // Handle duplicate key errors
  if ((err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Default error
  const statusCode = (error as any).statusCode || 500;
  const status = (error as any).status || 'error';

  const response: ErrorResponse = {
    status,
    message: error.message || 'Something went wrong',
  };

  // Include stack trace in development
  if (config.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Include validation errors if present
  if ((err as any).errors) {
    response.errors = (err as any).errors;
  }

  res.status(statusCode).json(response);
}; 