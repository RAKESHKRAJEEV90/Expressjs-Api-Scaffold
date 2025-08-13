import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import config from '../config';
import path from 'path';

const storage =
  config.UPLOAD_PROVIDER === 's3'
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/'),
        filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
      });

export const upload = multer({
  storage,
  limits: { fileSize: config.UPLOAD_MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (config.UPLOAD_ALLOWED_TYPES.split(',').includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  },
});

export const uploadToS3 = async (file: Express.Multer.File) => {
  const client = new S3Client({
    region: config.AWS_REGION,
    credentials: config.AWS_ACCESS_KEY_ID && config.AWS_SECRET_ACCESS_KEY ? {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    } : undefined,
  });
  const Key = `${Date.now()}-${file.originalname}`;
  await client.send(new PutObjectCommand({
    Bucket: config.AWS_BUCKET_NAME!,
    Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  const Location = `https://s3.${config.AWS_REGION}.amazonaws.com/${config.AWS_BUCKET_NAME}/${Key}`;
  return { Location, Key } as { Location: string; Key: string };
};