import multer from 'multer';
import AWS from 'aws-sdk';
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
  const s3 = new AWS.S3({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: config.AWS_REGION,
  });
  const params = {
    Bucket: config.AWS_BUCKET_NAME!,
    Key: `${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  return s3.upload(params).promise();
}; 