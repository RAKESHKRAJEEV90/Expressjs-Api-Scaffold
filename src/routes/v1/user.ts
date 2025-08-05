import { Router } from 'express';
import { createUser } from '../../controllers/userController';

const router = Router();

// POST /api/v1/user
router.post('/', createUser);

export default router; 