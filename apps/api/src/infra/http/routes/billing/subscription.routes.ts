import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { SubscriptionController } from '../../controllers/billing/subscription.controller';

export function createSubscriptionRoutes(container: Container) {
  const router = new Hono();
  const controller = new SubscriptionController(container);

  router.post('/checkout', (context) => controller.create_checkout(context));
  router.get('/unit/:unit_id', (context) => controller.get_by_unit(context));
  router.post('/:id/cancel', (context) => controller.cancel(context));

  return router;
}
