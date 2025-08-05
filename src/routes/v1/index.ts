import { Router } from 'express';
import authRoutes from './auth';
import healthRoutes from './health';
import uploadRoutes from './upload';
import userRoutes from './user';

const router = Router();

// Health check routes
router.use('/health', healthRoutes);

// Example test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'API v1 is working!' });
});

// Auth routes
router.use('/auth', authRoutes);

// File upload routes
router.use('/upload', uploadRoutes);

// User routes
router.use('/user', userRoutes);

export default router;
