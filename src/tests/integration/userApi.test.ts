import request from 'supertest';
import app from '../../app';
import * as eventModule from '../../events/UserCreatedEvent';

describe('User API integration', () => {
  it('should create a user and emit event', async () => {
    const emitSpy = jest.spyOn(eventModule, 'emitUserCreatedEvent').mockImplementation(() => {});
    const res = await request(app)
      .post('/api/v1/user')
      .send({ username: 'alice', email: 'alice@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.user).toMatchObject({ username: 'alice', email: 'alice@example.com' });
    expect(emitSpy).toHaveBeenCalled();
    emitSpy.mockRestore();
  });
}); 