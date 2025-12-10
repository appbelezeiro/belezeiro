import type { Container } from '@/infra/di/factory-root';

import { Hono } from 'hono';
import { createUserRoutes } from './user.routes';
import { createAuthRoutes } from './auth.routes';
import { createBookingRoutes } from './booking.routes';
import { createOrganizationRoutes } from './organization.routes';
import { createUnitRoutes } from './unit.routes';

export function createRoutes(container: Container) {
  const app = new Hono();

  app.route('/auth', createAuthRoutes(container));
  app.route('/users', createUserRoutes(container));
  app.route('/booking', createBookingRoutes(container));
  app.route('/organizations', createOrganizationRoutes(container));
  app.route('/units', createUnitRoutes(container));

  return app;
}
