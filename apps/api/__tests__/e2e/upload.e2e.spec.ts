import { describe, it, expect, beforeEach } from 'vitest';
import { createTestServer } from '../helpers/test-server';

describe('Upload E2E', () => {
  let server: ReturnType<typeof createTestServer>;
  let auth_token: string;
  let user_id: string;

  beforeEach(async () => {
    server = createTestServer();

    // Mock authentication - criar usuário e fazer login
    // TODO: Implementar setup de autenticação para testes E2E
    auth_token = 'mock_session_token';
    user_id = 'usr_test_123';
  });

  describe('POST /api/upload/generate-url', () => {
    it('should generate pre-signed URL for authenticated user', async () => {
      const response = await server
        .post('/api/upload/generate-url')
        .set('Cookie', `session_token=${auth_token}`)
        .send({
          type: 'profile',
          file_name: 'avatar.jpg',
          content_type: 'image/jpeg',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('upload_url');
      expect(response.body).toHaveProperty('key');
      expect(response.body).toHaveProperty('expires_at');
      expect(response.body.key).toContain('profile/');
    });

    it('should return 401 for unauthenticated user', async () => {
      const response = await server.post('/api/upload/generate-url').send({
        type: 'profile',
        file_name: 'avatar.jpg',
        content_type: 'image/jpeg',
      });

      expect(response.status).toBe(401);
    });

    it('should return 422 for invalid file type', async () => {
      const response = await server
        .post('/api/upload/generate-url')
        .set('Cookie', `session_token=${auth_token}`)
        .send({
          type: 'profile',
          file_name: 'document.pdf',
          content_type: 'application/pdf',
        });

      expect(response.status).toBe(422);
    });
  });

  describe('POST /api/upload/generate-batch-urls', () => {
    it('should generate multiple pre-signed URLs', async () => {
      const response = await server
        .post('/api/upload/generate-batch-urls')
        .set('Cookie', `session_token=${auth_token}`)
        .send({
          type: 'gallery',
          files: [
            { file_name: 'photo1.jpg', content_type: 'image/jpeg' },
            { file_name: 'photo2.png', content_type: 'image/png' },
            { file_name: 'photo3.webp', content_type: 'image/webp' },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.body.uploads).toHaveLength(3);
      expect(response.body.uploads[0]).toHaveProperty('upload_url');
      expect(response.body.uploads[0]).toHaveProperty('key');
      expect(response.body.uploads[0]).toHaveProperty('file_name');
    });

    it('should return 400 for more than 20 files', async () => {
      const files = Array.from({ length: 21 }, (_, i) => ({
        file_name: `photo${i}.jpg`,
        content_type: 'image/jpeg',
      }));

      const response = await server
        .post('/api/upload/generate-batch-urls')
        .set('Cookie', `session_token=${auth_token}`)
        .send({
          type: 'gallery',
          files,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/upload/confirm/user-photo', () => {
    it('should confirm user photo upload', async () => {
      // 1. Gerar pre-signed URL
      const generateResponse = await server
        .post('/api/upload/generate-url')
        .set('Cookie', `session_token=${auth_token}`)
        .send({
          type: 'profile',
          file_name: 'avatar.jpg',
          content_type: 'image/jpeg',
        });

      const { key } = generateResponse.body;

      // 2. Confirmar upload
      const confirmResponse = await server
        .post('/api/upload/confirm/user-photo')
        .set('Cookie', `session_token=${auth_token}`)
        .send({ key });

      expect(confirmResponse.status).toBe(200);
      expect(confirmResponse.body).toHaveProperty('url');
      expect(confirmResponse.body.url).toContain(key);
    });
  });
});
