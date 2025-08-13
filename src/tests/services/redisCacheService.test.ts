import * as cacheService from '../../services/redisCacheService';

describe('redisCacheService', () => {
  let mockClient: any;
  beforeAll(() => {
    // Inject mock redis client via test hook
    mockClient = {
      set: jest.fn(),
      get: jest.fn().mockResolvedValue(JSON.stringify({ foo: 'bar' })),
      del: jest.fn(),
    };
    (cacheService as any).__setRedisClient(mockClient);
  });

  it('should set a value', async () => {
    await cacheService.cacheSet('key', { foo: 'bar' }, 60);
    expect(mockClient.set).toHaveBeenCalled();
  });

  it('should get a value', async () => {
    const val = await cacheService.cacheGet('key');
    expect(val).toEqual({ foo: 'bar' });
  });

  it('should delete a value', async () => {
    await cacheService.cacheDel('key');
    expect(mockClient.del).toHaveBeenCalled();
  });
}); 