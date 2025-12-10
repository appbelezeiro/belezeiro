import { describe, it, expect, beforeEach } from 'vitest';
import { createTestServer } from '../helpers/test-server';

describe('Auth E2E', () => {
  let server: ReturnType<typeof createTestServer>;

  beforeEach(() => {
    server = createTestServer();
  });

  describe('POST /api/auth/social-login', () => {
    it('should create a new user and return 201 on first login', async () => {
      const response = await server
        .post('/api/auth/social-login')
        .send({
          name: 'Leonardo Oliveira',
          email: 'c.p.leonardooliveira@gmail.com',
          photoUrl: 'https://lh3.googleusercontent.com/a/ACg8ocIhrPL9YqBLkg41CIHFkBTXTNEbl01GfFXrkm7vowogbOQuCSBfjw=s96-c',
          providerId: '103410879415972377342',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('status', 'Logged successful');
      expect(response.headers['set-cookie']).toBeDefined();

      const cookies = Array.isArray(response.headers['set-cookie'])
        ? response.headers['set-cookie']
        : [response.headers['set-cookie']];
      expect(cookies.some((c: string) => c.startsWith('session_token='))).toBe(true);
      expect(cookies.some((c: string) => c.startsWith('refresh_token='))).toBe(true);
    });

    it('should authenticate existing user and return 200', async () => {
      const userData = {
        name: 'Leonardo Oliveira',
        email: 'c.p.leonardooliveira@gmail.com',
        photoUrl: 'https://lh3.googleusercontent.com/a/photo.jpg',
        providerId: '103410879415972377342',
      };

      await server.post('/api/auth/social-login').send(userData);

      const response = await server.post('/api/auth/social-login').send(userData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'Logged successful');
    });

    it('should return 409 when email exists with different providerId', async () => {
      await server.post('/api/auth/social-login').send({
        name: 'Leonardo Oliveira',
        email: 'c.p.leonardooliveira@gmail.com',
        photoUrl: 'https://lh3.googleusercontent.com/a/photo.jpg',
        providerId: 'provider-1',
      });

      const response = await server.post('/api/auth/social-login').send({
        name: 'Leonardo Oliveira',
        email: 'c.p.leonardooliveira@gmail.com',
        photoUrl: 'https://lh3.googleusercontent.com/a/photo.jpg',
        providerId: 'provider-2',
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'CONFLICT');
    });

    it('should return 422 when validation fails', async () => {
      const response = await server
        .post('/api/auth/social-login')
        .send({
          name: '',
          email: 'invalid-email',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('error', 'VALIDATION_ERROR');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh tokens successfully', async () => {
      const loginResponse = await server.post('/api/auth/social-login').send({
        name: 'Leonardo Oliveira',
        email: 'c.p.leonardooliveira@gmail.com',
        photoUrl: 'https://lh3.googleusercontent.com/a/photo.jpg',
        providerId: '103410879415972377342',
      });

      const cookies = Array.isArray(loginResponse.headers['set-cookie'])
        ? loginResponse.headers['set-cookie']
        : [loginResponse.headers['set-cookie']];
      const refresh_token_cookie = cookies.find((c: string) => c.startsWith('refresh_token='));

      const response = await server
        .post('/api/auth/refresh')
        .set('Cookie', refresh_token_cookie as string);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'Tokens refreshed successfully');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 when refresh token is missing', async () => {
      const response = await server.post('/api/auth/refresh');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'UNAUTHORIZED');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await server.post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'Logged out successfully');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile when authenticated', async () => {
      const loginResponse = await server.post('/api/auth/social-login').send({
        name: 'Leonardo Oliveira',
        email: 'c.p.leonardooliveira@gmail.com',
        photoUrl: 'https://lh3.googleusercontent.com/a/photo.jpg',
        providerId: '103410879415972377342',
      });

      const cookies = Array.isArray(loginResponse.headers['set-cookie'])
        ? loginResponse.headers['set-cookie']
        : [loginResponse.headers['set-cookie']];
      const session_token_cookie = cookies.find((c: string) => c.startsWith('session_token='));

      const response = await server
        .get('/api/auth/me')
        .set('Cookie', session_token_cookie as string);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('email', 'c.p.leonardooliveira@gmail.com');
      expect(response.body).toHaveProperty('name', 'Leonardo Oliveira');
      expect(response.body).toHaveProperty('photoUrl');
    });

    it('should return 401 when not authenticated', async () => {
      const response = await server.get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'UNAUTHORIZED');
    });
  });
});
