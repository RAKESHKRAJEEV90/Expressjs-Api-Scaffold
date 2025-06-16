import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

export const metricsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics);
  } catch (error) {
    next(error);
  }
};