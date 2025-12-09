import { describe, it, expect, beforeEach } from 'vitest';
import { createTestServer } from '../helpers/test-server';

describe('User E2E', () => {
  let server: ReturnType<typeof createTestServer>;

  beforeEach(() => {
    server = createTestServer();
  });

  describe('POST /api/users', () => {
    it('should create a new user successfully', async () => {
      const response = await server
        .post('/api/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'John Doe');
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should return 422 if required fields are missing', async () => {
      const response = await server
        .post('/api/users')
        .send({
          name: 'John Doe',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('error', "VALIDATION_ERROR");
      expect(response.body).toHaveProperty('timestamp', expect.any(String));
      expect(response.body).toHaveProperty('details', expect.arrayContaining([
        expect.objectContaining({
          field: 'email',
        }),
      ]));
      expect(response.body).toHaveProperty('path', "/api/users");

      expect(response.headers['content-type']).toMatch(/application\/json/);
    })
  });
});
