import { Request, Response } from 'express';
import { cacheSet, cacheGet, cacheDel } from '../services/redisCacheService';

/**
 * Sample controller to demonstrate Redis cache usage
 */
export async function cacheDemo(req: Request, res: Response) {
  const { key, value, ttl } = req.body;
  if (!key) return res.status(400).json({ error: 'Key is required' });

  // Set cache
  if (value !== undefined) {
    await cacheSet(key, value, ttl ? Number(ttl) : undefined);
  }

  // Get cache
  const cached = await cacheGet(key);

  // Optionally delete cache
  if (req.body.del) {
    await cacheDel(key);
  }

  res.json({ key, cached });
} 