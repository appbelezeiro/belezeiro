import type { Container } from '@/infra/di/factory-root';

import { Hono } from 'hono';
import { createUserRoutes } from './users/user.routes';
import { createAuthRoutes } from './auth/auth.routes';
import { createBookingRoutes } from './bookings/booking.routes';
import { createOrganizationRoutes } from './organizations/organization.routes';
import { createUnitRoutes } from './units/unit.routes';
import { createPlanRoutes } from './billing/plan.routes';
import { createSubscriptionRoutes } from './billing/subscription.routes';
import { createWebhookRoutes } from './billing/webhook.routes';
import { createDiscountRoutes } from './billing/discount.routes';

export function createRoutes(container: Container) {
  const app = new Hono();

  app.route('/auth', createAuthRoutes(container));
  app.route('/users', createUserRoutes(container));
  app.route('/booking', createBookingRoutes(container));
  app.route('/organizations', createOrganizationRoutes(container));
  app.route('/units', createUnitRoutes(container));

  // Billing routes
  app.route('/plans', createPlanRoutes(container));
  app.route('/subscriptions', createSubscriptionRoutes(container));
  app.route('/webhooks', createWebhookRoutes(container));
  app.route('/discounts', createDiscountRoutes(container));

  return app;
}
