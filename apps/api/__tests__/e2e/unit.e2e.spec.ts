import { describe, it, expect, beforeEach } from 'vitest';
import { createTestServer } from '../helpers/test-server';

describe('Unit E2E', () => {
  let server: ReturnType<typeof createTestServer>;

  beforeEach(() => {
    server = createTestServer();
  });

  const validUnitPayload = {
    organizationId: 'org_123',
    name: 'Unidade Centro',
    whatsapp: '+5511999999999',
    address: {
      cep: '01310-100',
      street: 'Av. Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
    },
    professions: [{ id: 'prof_cabeleireiro', name: 'Cabeleireiro(a)', icon: '✂️' }],
    services: [
      { id: 'serv_corte_feminino', name: 'Corte Feminino', professionId: 'prof_cabeleireiro' },
    ],
    serviceType: 'local',
    amenities: ['wifi', 'parking'],
    workingHours: {
      monday: { enabled: true, open: '09:00', close: '18:00' },
      tuesday: { enabled: true, open: '09:00', close: '18:00' },
      wednesday: { enabled: true, open: '09:00', close: '18:00' },
      thursday: { enabled: true, open: '09:00', close: '18:00' },
      friday: { enabled: true, open: '09:00', close: '18:00' },
      saturday: { enabled: true, open: '09:00', close: '14:00' },
      sunday: { enabled: false, open: '00:00', close: '00:00' },
    },
  };

  describe('POST /api/units', () => {
    it('should create a new unit successfully', async () => {
      const response = await server
        .post('/api/units')
        .send(validUnitPayload)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Unidade Centro');
      expect(response.body.isActive).toBe(true);
      expect(response.body.professions).toHaveLength(1);
      expect(response.body.services).toHaveLength(1);
    });

    it('should create unit with optional fields', async () => {
      const payload = {
        ...validUnitPayload,
        logo: 'https://example.com/logo.png',
        gallery: ['https://example.com/photo1.jpg'],
        phone: '+5511988888888',
        lunchBreak: {
          enabled: true,
          start: '12:00',
          end: '13:00',
        },
      };

      const response = await server.post('/api/units').send(payload);

      expect(response.status).toBe(201);
      expect(response.body.logo).toBe('https://example.com/logo.png');
      expect(response.body.lunchBreak).toBeDefined();
    });

    it('should return 422 if validation fails', async () => {
      const response = await server
        .post('/api/units')
        .send({
          ...validUnitPayload,
          address: {
            ...validUnitPayload.address,
            cep: 'invalid',
          },
        });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('error', 'VALIDATION_ERROR');
    });

    it('should return 400 if working hours are invalid', async () => {
      const response = await server
        .post('/api/units')
        .send({
          ...validUnitPayload,
          workingHours: {
            ...validUnitPayload.workingHours,
            monday: { enabled: true, open: '18:00', close: '09:00' },
          },
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/units/:id', () => {
    it('should return unit by id', async () => {
      const createResponse = await server.post('/api/units').send(validUnitPayload);

      const { id } = createResponse.body;

      const response = await server.get(`/api/units/${id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(id);
      expect(response.body.name).toBe('Unidade Centro');
    });

    it('should return 404 if unit not found', async () => {
      const response = await server.get('/api/units/unit_INVALID');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'NOT_FOUND');
    });
  });

  describe('GET /api/units/organization/:organizationId', () => {
    it('should list units by organization', async () => {
      await server.post('/api/units').send(validUnitPayload);
      await server.post('/api/units').send({
        ...validUnitPayload,
        name: 'Unidade Jardins',
      });

      const response = await server.get('/api/units/organization/org_123');

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(2);
      expect(response.body.total).toBe(2);
    });
  });

  describe('GET /api/units/active', () => {
    it('should list only active units', async () => {
      await server.post('/api/units').send(validUnitPayload);

      const createResponse = await server.post('/api/units').send({
        ...validUnitPayload,
        name: 'Inactive Unit',
        organizationId: 'org_456',
      });

      await server.put(`/api/units/${createResponse.body.id}`).send({
        isActive: false,
      });

      const response = await server.get('/api/units/active');

      expect(response.status).toBe(200);
      expect(response.body.items.length).toBeGreaterThanOrEqual(1);
      expect(response.body.items.every((unit: any) => unit.isActive)).toBe(true);
    });
  });

  describe('PUT /api/units/:id', () => {
    it('should update unit successfully', async () => {
      const createResponse = await server.post('/api/units').send(validUnitPayload);

      const { id } = createResponse.body;

      const response = await server
        .put(`/api/units/${id}`)
        .send({
          name: 'Updated Name',
          isActive: false,
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
      expect(response.body.isActive).toBe(false);
    });

    it('should return 404 if unit not found', async () => {
      const response = await server
        .put('/api/units/unit_INVALID')
        .send({
          name: 'Test',
        });

      expect(response.status).toBe(404);
    });
  });
});
