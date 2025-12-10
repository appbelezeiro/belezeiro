import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { WebhookController } from '../../controllers/billing/webhook.controller';

export function createWebhookRoutes(container: Container) {
  const router = new Hono();
  const controller = new WebhookController(container);

  router.post('/payment-provider', (context) => controller.handle_payment_provider(context));

  return router;
}
