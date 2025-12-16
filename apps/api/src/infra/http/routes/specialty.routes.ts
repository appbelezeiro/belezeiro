import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { SpecialtyController } from '../controllers/specialty.controller';

export function createSpecialtyRoutes(container: Container) {
  const router = new Hono();
  const controller = new SpecialtyController(container);

  router.post('/', (c) => controller.create(c));
  router.get('/', (c) => controller.list(c));
  router.get('/:id', (c) => controller.get_by_id(c));

  return router;
}
