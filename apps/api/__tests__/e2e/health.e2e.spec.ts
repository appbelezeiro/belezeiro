import { describe, it, expect } from 'vitest';
import { createTestServer } from '../helpers/test-server';

describe('Health Check E2E', () => {
  it('should return health status', async () => {
    const server = createTestServer();

    const response = await server.get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });
});
