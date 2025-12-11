import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { AmenityController } from '../controllers/amenity.controller';

export function createAmenityRoutes(container: Container) {
  const router = new Hono();
  const controller = new AmenityController(container);

  router.post('/', (c) => controller.create(c));
  router.get('/', (c) => controller.list(c));
  router.get('/search', (c) => controller.search(c));
  router.post('/seed', (c) => controller.seed(c));
  router.get('/:id', (c) => controller.get_by_id(c));
  router.patch('/:id', (c) => controller.update(c));
  router.post('/:id/activate', (c) => controller.activate(c));
  router.post('/:id/deactivate', (c) => controller.deactivate(c));

  return router;
}
