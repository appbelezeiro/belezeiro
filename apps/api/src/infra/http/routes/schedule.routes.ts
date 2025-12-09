import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { ScheduleController } from '../controllers/schedule.controller';

export function createScheduleRoutes(container: Container) {
  const router = new Hono();
  const controller = new ScheduleController(container);

  router.get('/user/:user_id/slots', (c) => controller.getSlotsByDay(c));

  return router;
}
