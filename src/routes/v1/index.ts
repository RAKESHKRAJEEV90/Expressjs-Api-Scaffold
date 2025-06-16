import { Router } from 'express';
import authRoutes from './auth';
import healthRoutes from './health';

const router = Router();

// Health check routes
router.use('/health', healthRoutes);

// Example test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'API v1 is working!' });
});

// Auth routes
router.use('/auth', authRoutes);

export default router;
