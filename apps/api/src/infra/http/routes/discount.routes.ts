import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { DiscountController } from '../controllers/discount.controller';

export function createDiscountRoutes(container: Container) {
  const router = new Hono();
  const controller = new DiscountController(container);

  router.get('/validate/:code', (context) => controller.validate_code(context));

  return router;
}
