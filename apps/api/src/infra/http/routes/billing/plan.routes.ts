import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { PlanController } from '../../controllers/billing/plan.controller';

export function createPlanRoutes(container: Container) {
  const router = new Hono();
  const controller = new PlanController(container);

  router.get('/', (context) => controller.list_active(context));
  router.get('/:id', (context) => controller.get_by_id(context));

  return router;
}
