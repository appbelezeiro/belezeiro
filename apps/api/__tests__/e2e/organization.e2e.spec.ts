import { describe, it, expect, beforeEach } from 'vitest';
import { createTestServer } from '../helpers/test-server';

describe('Organization E2E', () => {
  let server: ReturnType<typeof createTestServer>;

  beforeEach(() => {
    server = createTestServer();
  });

  describe('POST /api/organizations', () => {
    it('should create a new organization successfully', async () => {
      const response = await server
        .post('/api/organizations')
        .send({
          businessName: 'Beleza Salon',
          brandColor: '#FF5733',
          ownerId: 'usr_123',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.businessName).toBe('Beleza Salon');
      expect(response.body.brandColor).toBe('#FF5733');
      expect(response.body.ownerId).toBe('usr_123');
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should create organization with subscription', async () => {
      const response = await server
        .post('/api/organizations')
        .send({
          businessName: 'Premium Salon',
          brandColor: '#00FF00',
          ownerId: 'usr_456',
          subscription: {
            plan: 'pro',
            status: 'active',
            expiresAt: '2025-12-31T23:59:59.000Z',
          },
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.subscription).toBeDefined();
      expect(response.body.subscription.plan).toBe('pro');
    });

    it('should return 422 if validation fails', async () => {
      const response = await server
        .post('/api/organizations')
        .send({
          businessName: 'A', // Too short
          brandColor: 'invalid',
          ownerId: 'usr_999',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('error', 'VALIDATION_ERROR');
    });

    it('should return 409 if organization already exists for owner', async () => {
      const payload = {
        businessName: 'Test Salon',
        brandColor: '#FF0000',
        ownerId: 'usr_789',
      };

      await server.post('/api/organizations').send(payload);

      const response = await server.post('/api/organizations').send(payload);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'CONFLICT');
    });
  });

  describe('GET /api/organizations/:id', () => {
    it('should return organization by id', async () => {
      const createResponse = await server
        .post('/api/organizations')
        .send({
          businessName: 'Test Salon',
          brandColor: '#AABBCC',
          ownerId: 'usr_111',
        });

      const { id } = createResponse.body;

      const response = await server.get(`/api/organizations/${id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(id);
      expect(response.body.businessName).toBe('Test Salon');
    });

    it('should return 404 if organization not found', async () => {
      const response = await server.get('/api/organizations/org_INVALID');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'NOT_FOUND');
    });
  });

  describe('GET /api/organizations/owner/:ownerId', () => {
    it('should return organization by owner id', async () => {
      await server.post('/api/organizations').send({
        businessName: 'Owner Test',
        brandColor: '#112233',
        ownerId: 'usr_owner_test',
      });

      const response = await server.get('/api/organizations/owner/usr_owner_test');

      expect(response.status).toBe(200);
      expect(response.body.ownerId).toBe('usr_owner_test');
    });
  });

  describe('PUT /api/organizations/:id', () => {
    it('should update organization successfully', async () => {
      const createResponse = await server
        .post('/api/organizations')
        .send({
          businessName: 'Original Name',
          brandColor: '#FF0000',
          ownerId: 'usr_update',
        });

      const { id } = createResponse.body;

      const response = await server
        .put(`/api/organizations/${id}`)
        .send({
          businessName: 'Updated Name',
          brandColor: '#00FF00',
        });

      expect(response.status).toBe(200);
      expect(response.body.businessName).toBe('Updated Name');
      expect(response.body.brandColor).toBe('#00FF00');
    });

    it('should return 404 if organization not found', async () => {
      const response = await server
        .put('/api/organizations/org_INVALID')
        .send({
          businessName: 'Test',
        });

      expect(response.status).toBe(404);
    });
  });
});
