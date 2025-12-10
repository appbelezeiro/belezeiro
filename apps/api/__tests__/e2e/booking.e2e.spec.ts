import { describe, it, expect, beforeEach } from 'vitest';
import { createTestServer } from '../helpers/test-server';

describe('Booking E2E', () => {
  let server: ReturnType<typeof createTestServer>;

  beforeEach(() => {
    server = createTestServer();
  });

  describe('POST /api/bookings', () => {
    it('should create a booking successfully', async () => {
      // First create a booking rule
      const ruleResponse = await server
        .post('/api/booking-rules')
        .send({
          user_id: 'user_1',
          type: 'weekly',
          weekday: 2,
          start_time: '2025-01-14T10:00:00.000Z',
          end_time: '2025-01-14T18:00:00.000Z',
          slot_duration_minutes: 60,
        })
        .set('Content-Type', 'application/json');

      expect(ruleResponse.status).toBe(201);

      // Then create a booking
      const response = await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: '2025-12-16T10:00:00.000Z',
          end_at: '2025-12-16T11:00:00.000Z',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('booking_id');
      expect(response.body).toHaveProperty('status', 'confirmed');
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should return 422 if required fields are missing', async () => {
      const response = await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('error', 'VALIDATION_ERROR');
    });

    it('should return 400 if booking is in the past', async () => {
      const past = new Date();
      past.setHours(past.getHours() - 2);

      const response = await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: past.toISOString(),
          end_at: new Date(past.getTime() + 3600000).toISOString(),
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'BAD_REQUEST');
      expect(response.body.message).toContain('past');
    });

    it('should return 400 if start_at >= end_at', async () => {
      const response = await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: '2025-12-16T11:00:00.000Z',
          end_at: '2025-12-16T10:00:00.000Z',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'BAD_REQUEST');
    });

    it('should return 409 if booking overlaps with existing', async () => {
      await server
        .post('/api/booking-rules')
        .send({
          user_id: 'user_1',
          type: 'weekly',
          weekday: 2,
          start_time: '2025-01-14T10:00:00.000Z',
          end_time: '2025-01-14T18:00:00.000Z',
          slot_duration_minutes: 60,
        })
        .set('Content-Type', 'application/json');

      // Create first booking
      await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: '2025-12-16T10:00:00.000Z',
          end_at: '2025-12-16T11:00:00.000Z',
        })
        .set('Content-Type', 'application/json');

      // Try overlapping booking
      const response = await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
          client_id: 'client_2',
          start_at: '2025-12-16T10:30:00.000Z',
          end_at: '2025-12-16T11:30:00.000Z',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'CONFLICT');
    });

    it('should return 400 if booking does not meet minimum advance time', async () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      const weekday = future.getUTCDay();

      await server
        .post('/api/booking-rules')
        .send({
          user_id: 'user_1',
          type: 'weekly',
          weekday,
          start_time: '2025-01-14T10:00:00.000Z',
          end_time: '2025-01-14T18:00:00.000Z',
          slot_duration_minutes: 60,
          min_advance_minutes: 120,
        })
        .set('Content-Type', 'application/json');

      const start = new Date();
      start.setMinutes(start.getMinutes() + 30);

      const response = await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: start.toISOString(),
          end_at: new Date(start.getTime() + 3600000).toISOString(),
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'BAD_REQUEST');
      expect(response.body.message).toContain('advance');
    });

    it('should return 400 if booking exceeds maximum duration', async () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      const weekday = future.getUTCDay();

      await server
        .post('/api/booking-rules')
        .send({
          user_id: 'user_1',
          type: 'weekly',
          weekday,
          start_time: '2025-01-14T10:00:00.000Z',
          end_time: '2025-01-14T18:00:00.000Z',
          slot_duration_minutes: 60,
          max_duration_minutes: 90,
        })
        .set('Content-Type', 'application/json');

      const start = new Date(future);
      start.setHours(10, 0, 0, 0);

      const response = await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: start.toISOString(),
          end_at: new Date(start.getTime() + 120 * 60000).toISOString(),
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'BAD_REQUEST');
      expect(response.body.message).toContain('duration');
    });

    it('should return 400 if duration is not multiple of slot', async () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      const weekday = future.getUTCDay();

      await server
        .post('/api/booking-rules')
        .send({
          user_id: 'user_1',
          type: 'weekly',
          weekday,
          start_time: '2025-01-14T10:00:00.000Z',
          end_time: '2025-01-14T18:00:00.000Z',
          slot_duration_minutes: 60,
        })
        .set('Content-Type', 'application/json');

      const start = new Date(future);
      start.setHours(10, 0, 0, 0);

      const response = await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: start.toISOString(),
          end_at: new Date(start.getTime() + 45 * 60000).toISOString(),
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'BAD_REQUEST');
      expect(response.body.message).toContain('multiple');
    });

    it('should return 409 if daily booking limit is exceeded', async () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      const weekday = future.getUTCDay();

      await server
        .post('/api/booking-rules')
        .send({
          user_id: 'user_1',
          type: 'weekly',
          weekday,
          start_time: '2025-01-14T08:00:00.000Z',
          end_time: '2025-01-14T18:00:00.000Z',
          slot_duration_minutes: 60,
          max_bookings_per_day: 2,
        })
        .set('Content-Type', 'application/json');

      const start1 = new Date(future);
      start1.setHours(8, 0, 0, 0);

      await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: start1.toISOString(),
          end_at: new Date(start1.getTime() + 3600000).toISOString(),
        })
        .set('Content-Type', 'application/json');

      const start2 = new Date(future);
      start2.setHours(10, 0, 0, 0);

      await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
          client_id: 'client_2',
          start_at: start2.toISOString(),
          end_at: new Date(start2.getTime() + 3600000).toISOString(),
        })
        .set('Content-Type', 'application/json');

      const start3 = new Date(future);
      start3.setHours(12, 0, 0, 0);

      const response = await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
          client_id: 'client_3',
          start_at: start3.toISOString(),
          end_at: new Date(start3.getTime() + 3600000).toISOString(),
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'CONFLICT');
      expect(response.body.message).toContain('limit');
    });

    it('should return 409 if client daily booking limit is exceeded', async () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);
      const weekday = future.getUTCDay();

      await server
        .post('/api/booking-rules')
        .send({
          user_id: 'user_1',
          type: 'weekly',
          weekday,
          start_time: '2025-01-14T08:00:00.000Z',
          end_time: '2025-01-14T18:00:00.000Z',
          slot_duration_minutes: 60,
          max_bookings_per_client_per_day: 1,
        })
        .set('Content-Type', 'application/json');

      const start1 = new Date(future);
      start1.setHours(8, 0, 0, 0);

      await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: start1.toISOString(),
          end_at: new Date(start1.getTime() + 3600000).toISOString(),
        })
        .set('Content-Type', 'application/json');

      const start2 = new Date(future);
      start2.setHours(10, 0, 0, 0);

      const response = await server
        .post('/api/bookings')
        .send({
          user_id: 'user_1',
          client_id: 'client_1',
          start_at: start2.toISOString(),
          end_at: new Date(start2.getTime() + 3600000).toISOString(),
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('error', 'CONFLICT');
      expect(response.body.message).toContain('client');
    });
  });
});
