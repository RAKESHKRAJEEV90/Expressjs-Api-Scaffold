import { Request, Response } from 'express';
import config from '../config';
import { uploadToS3 } from '../services/uploadService';

/**
 * Sample controller to handle file uploads
 */
export async function uploadFile(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  if (config.UPLOAD_PROVIDER === 's3') {
    try {
      const result = await uploadToS3(req.file);
      return res.json({ url: result.Location, key: result.Key });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to upload to S3', details: err });
    }
  } else {
    // Local upload: file is already saved by multer
    return res.json({ filename: req.file.filename, path: req.file.path });
  }
} 