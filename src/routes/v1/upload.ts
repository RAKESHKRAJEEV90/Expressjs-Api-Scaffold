import { Router } from 'express';
import { upload } from '../../services/uploadService';
import { uploadFile } from '../../controllers/uploadController';

const router = Router();

// POST /api/v1/upload
router.post('/', upload.single('file'), uploadFile);

export default router; 