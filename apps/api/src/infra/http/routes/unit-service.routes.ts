import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { UnitServiceController } from '../controllers/unit-service.controller';

export function createUnitServiceRoutes(container: Container) {
  const router = new Hono();
  const controller = new UnitServiceController(container);

  router.get('/:unit_id/services', (c) => controller.list_by_unit(c));
  router.post('/:unit_id/services', (c) => controller.add(c));
  router.put('/:unit_id/services/:service_id', (c) => controller.update(c));
  router.delete('/:unit_id/services/:service_id', (c) => controller.remove(c));

  return router;
}
