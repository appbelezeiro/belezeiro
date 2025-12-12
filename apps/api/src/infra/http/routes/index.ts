import type { Container } from '@/infra/di/factory-root';

import { Hono } from 'hono';
import { createAuthRoutes } from './auth/auth.routes';
import { createBookingRoutes } from './bookings/booking.routes';
import { createOrganizationRoutes } from './organizations/organization.routes';
import { createUnitRoutes } from './units/unit.routes';
import { createUnitAvailabilityRoutes } from './units/unit-availability.routes';
import { createPlanRoutes } from './billing/plan.routes';
import { createSubscriptionRoutes } from './billing/subscription.routes';
import { createWebhookRoutes } from './billing/webhook.routes';
import { createDiscountRoutes } from './billing/discount.routes';
import { createSpecialtyRoutes } from './specialty.routes';
import { createServiceRoutes } from './service.routes';
import { createUnitSpecialtyRoutes } from './unit-specialty.routes';
import { createUnitServiceRoutes } from './unit-service.routes';
import { createUploadRoutes } from './upload.routes';
import { createAmenityRoutes } from './amenity.routes';
import { createUnitAmenityRoutes } from './unit-amenity.routes';
import { createDashboardRoutes } from './dashboard/dashboard.routes';
import { createAuthMiddleware } from '../middleware/auth.middleware';

export function createRoutes(container: Container) {
  const app = new Hono();
  const auth_middleware = createAuthMiddleware(container.services.token_service);

  app.route('/auth', createAuthRoutes(container));

  app.route('/webhooks', createWebhookRoutes(container));

  app.use(auth_middleware);

  app.route('/booking', createBookingRoutes(container));
  app.route('/organizations', createOrganizationRoutes(container));
  app.route('/units', createUnitRoutes(container));
  app.route('/unit-availability', createUnitAvailabilityRoutes(container));
  app.route('/upload', createUploadRoutes(container));

  // Specialties and Services routes
  app.route('/specialties', createSpecialtyRoutes(container));
  app.route('/services', createServiceRoutes(container));

  // Amenities routes
  app.route('/amenities', createAmenityRoutes(container));

  // Unit-Specialty and Unit-Service routes (nested under /units)
  app.route('/units', createUnitSpecialtyRoutes(container));
  app.route('/units', createUnitServiceRoutes(container));

  // Unit-Amenity routes (nested under /units)
  app.route('/units', createUnitAmenityRoutes(container));

  // Billing routes
  app.route('/plans', createPlanRoutes(container));
  app.route('/subscriptions', createSubscriptionRoutes(container));
  app.route('/discounts', createDiscountRoutes(container));

  // Dashboard routes
  app.route('/dashboard', createDashboardRoutes(container));

  return app;
}
