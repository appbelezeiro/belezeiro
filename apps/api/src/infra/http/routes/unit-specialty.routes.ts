import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { UnitSpecialtyController } from '../controllers/unit-specialty.controller';

export function createUnitSpecialtyRoutes(container: Container) {
  const router = new Hono();
  const controller = new UnitSpecialtyController(container);

  router.get('/:unit_id/specialties', (c) => controller.list_by_unit(c));
  router.post('/:unit_id/specialties', (c) => controller.link(c));
  router.delete('/:unit_id/specialties/:specialty_id', (c) => controller.unlink(c));

  return router;
}
