import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { UnitAmenityController } from '../controllers/unit-amenity.controller';

export function createUnitAmenityRoutes(container: Container) {
  const router = new Hono();
  const controller = new UnitAmenityController(container);

  router.get('/:unit_id/amenities', (c) => controller.list_by_unit(c));
  router.post('/:unit_id/amenities', (c) => controller.link(c));
  router.delete('/:unit_id/amenities/:amenity_id', (c) => controller.unlink(c));

  return router;
}
