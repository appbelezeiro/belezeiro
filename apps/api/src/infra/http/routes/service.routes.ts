import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { ServiceController } from '../controllers/service.controller';

export function createServiceRoutes(container: Container) {
  const router = new Hono();
  const controller = new ServiceController(container);

  router.post('/', (c) => controller.create(c));
  router.get('/', (c) => controller.list(c));
  router.get('/search', (c) => controller.search(c));
  router.get('/:id', (c) => controller.get_by_id(c));
  router.put('/:id', (c) => controller.update(c));
  router.delete('/:id', (c) => controller.delete(c));

  return router;
}
