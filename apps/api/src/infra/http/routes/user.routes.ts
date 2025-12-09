import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { UserController } from '../controllers/user.controller';

export function createUserRoutes(container: Container) {
  const router = new Hono();
  const controller = new UserController(container);

  router.post('/', (context) => controller.create(context));

  return router;
}
