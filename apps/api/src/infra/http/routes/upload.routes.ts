import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { UploadController } from '../controllers/storage/upload.controller';
import { createAuthMiddleware } from '../middleware/auth.middleware';
import { createUnitOwnershipMiddleware } from '../middleware/unit-ownership.middleware';

export function createUploadRoutes(container: Container) {
  const router = new Hono();
  const controller = new UploadController(container);
  const auth_middleware = createAuthMiddleware(container.services.token_service);
  const unit_ownership_middleware = createUnitOwnershipMiddleware(container);

  // Todas as rotas requerem autenticação
  router.use('*', auth_middleware);

  // ========== SINGLE UPLOAD ==========
  router.post('/generate-url', (c) => controller.generate_upload_url(c));

  // ========== BATCH UPLOAD ==========
  router.post('/generate-batch-urls', (c) => controller.generate_batch_upload_urls(c));

  // ========== CONFIRMAR UPLOADS ==========

  // User photo
  router.post('/confirm/user-photo', (c) => controller.confirm_user_photo_upload(c));

  // Unit logo e gallery - com validação de ownership
  router.post(
    '/confirm/unit/:unit_id/logo',
    unit_ownership_middleware,
    (c) => controller.confirm_unit_logo_upload(c)
  );

  router.post(
    '/confirm/unit/:unit_id/gallery',
    unit_ownership_middleware,
    (c) => controller.add_unit_gallery_photo(c)
  );

  // ========== BATCH CONFIRM ==========
  router.post(
    '/confirm/unit/:unit_id/gallery/batch',
    unit_ownership_middleware,
    (c) => controller.confirm_batch_gallery_upload(c)
  );

  // ========== REMOVER FOTO DA GALERIA ==========
  router.delete(
    '/unit/:unit_id/gallery/:photo_url',
    unit_ownership_middleware,
    (c) => controller.remove_unit_gallery_photo(c)
  );

  return router;
}
