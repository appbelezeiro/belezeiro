import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { ScheduleRuleController } from '../controllers/schedule-rule.controller';

export function createScheduleRuleRoutes(container: Container) {
  const router = new Hono();
  const controller = new ScheduleRuleController(container);

  router.post('/', (c) => controller.create(c));
  router.get('/user/:user_id', (c) => controller.getByUser(c));

  return router;
}
