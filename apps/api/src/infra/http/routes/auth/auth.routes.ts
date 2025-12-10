import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { AuthController } from '../../controllers/auth/auth.controller';
import { createAuthMiddleware } from '../../middleware/auth.middleware';

export function createAuthRoutes(container: Container) {
  const router = new Hono();
  const controller = new AuthController(container);
  const auth_middleware = createAuthMiddleware(container.services.token_service);

  router.post('/social-login', (context) => controller.social_login(context));
  router.post('/refresh', (context) => controller.refresh(context));
  router.post('/logout', (context) => controller.logout(context));
  router.get('/me', auth_middleware, (context) => controller.me(context));

  return router;
}
