import * as cacheService from '../../services/redisCacheService';

describe('redisCacheService', () => {
  beforeAll(() => {
    // Mock redisClient
    (cacheService as any).redisClient = {
      set: jest.fn(),
      get: jest.fn().mockResolvedValue(JSON.stringify({ foo: 'bar' })),
      del: jest.fn(),
    };
  });

  it('should set a value', async () => {
    await cacheService.cacheSet('key', { foo: 'bar' }, 60);
    expect((cacheService as any).redisClient.set).toHaveBeenCalled();
  });

  it('should get a value', async () => {
    const val = await cacheService.cacheGet('key');
    expect(val).toEqual({ foo: 'bar' });
  });

  it('should delete a value', async () => {
    await cacheService.cacheDel('key');
    expect((cacheService as any).redisClient.del).toHaveBeenCalled();
  });
}); 