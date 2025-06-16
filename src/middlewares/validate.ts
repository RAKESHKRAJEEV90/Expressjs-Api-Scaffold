import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ValidationError } from '../utils/AppError';

export const validate =
  (schema: ZodSchema<any>, property: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[property]);
      next();
    } catch (err: any) {
      throw new ValidationError(err.errors?.map((e: any) => e.message).join(', '));
    }
  }; 