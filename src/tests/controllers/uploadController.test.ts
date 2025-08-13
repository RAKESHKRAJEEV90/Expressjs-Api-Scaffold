import { uploadFile } from '../../controllers/uploadController';
import * as uploadService from '../../services/uploadService';

const mockReq = (file: any, provider: string) => ({ file, body: {}, config: { UPLOAD_PROVIDER: provider } } as any);
const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('uploadController.uploadFile', () => {
  it('should upload to S3 if enabled', async () => {
    jest.spyOn(uploadService, 'uploadToS3').mockResolvedValue({ Location: 's3url', Key: 'filekey' });
    const req = { file: { originalname: 'file.txt', buffer: Buffer.from('test') }, body: {} } as any;
    const res = mockRes();
    // Force provider via env for this test
    process.env.UPLOAD_PROVIDER = 's3';
    await uploadFile(req, res);
    expect(res.json).toHaveBeenCalledWith({ url: 's3url', key: 'filekey' });
  });

  it('should return local file info if not S3', async () => {
    const req = { file: { filename: 'file.txt', path: '/uploads/file.txt' }, body: {} } as any;
    const res = mockRes();
    process.env.UPLOAD_PROVIDER = 'local';
    await uploadFile(req, res);
    expect(res.json).toHaveBeenCalledWith({ filename: 'file.txt', path: '/uploads/file.txt' });
  });
}); 