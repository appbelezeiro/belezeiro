import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { ScheduleExceptionController } from '../controllers/schedule-exception.controller';

export function createScheduleExceptionRoutes(container: Container) {
  const router = new Hono();
  const controller = new ScheduleExceptionController(container);

  router.post('/', (c) => controller.create(c));
  router.get('/user/:user_id', (c) => controller.getByUser(c));

  return router;
}
