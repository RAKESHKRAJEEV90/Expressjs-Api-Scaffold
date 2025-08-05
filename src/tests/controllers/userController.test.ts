import { createUser } from '../../controllers/userController';
import * as eventModule from '../../events/UserCreatedEvent';

const mockReq = (body: any) => ({ body } as any);
const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('userController.createUser', () => {
  it('should create a user and emit event', async () => {
    const emitSpy = jest.spyOn(eventModule, 'emitUserCreatedEvent').mockImplementation(() => {});
    const req = mockReq({ username: 'alice', email: 'alice@example.com' });
    const res = mockRes();
    await createUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user: expect.objectContaining({ username: 'alice', email: 'alice@example.com' }) }));
    expect(emitSpy).toHaveBeenCalled();
    emitSpy.mockRestore();
  });
}); 