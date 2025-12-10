import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { OrganizationController } from '../../controllers/organizations/organization.controller';

export function createOrganizationRoutes(container: Container) {
  const router = new Hono();
  const controller = new OrganizationController(container);

  router.post('/', (context) => controller.create(context));
  router.get('/:id', (context) => controller.get_by_id(context));
  router.get('/owner/:ownerId', (context) => controller.get_by_owner(context));
  router.put('/:id', (context) => controller.update(context));

  return router;
}
