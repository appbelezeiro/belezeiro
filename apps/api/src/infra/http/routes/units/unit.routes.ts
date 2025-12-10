import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { UnitController } from '../../controllers/units/unit.controller';

export function createUnitRoutes(container: Container) {
  const router = new Hono();
  const controller = new UnitController(container);

  router.post('/', (context) => controller.create(context));
  router.get('/active', (context) => controller.list_active(context));
  router.get('/:id', (context) => controller.get_by_id(context));
  router.get('/organization/:organizationId', (context) =>
    controller.list_by_organization(context)
  );
  router.put('/:id', (context) => controller.update(context));

  return router;
}
