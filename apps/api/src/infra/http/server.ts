import { Hono } from 'hono';
import { container } from '../di/factory-root';
import { createRoutes } from './routes';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '../services/ulidx-id-generator.service';
import { globalErrorHandler } from './middleware/global-error.middleware';

export function createServer() {
  const app = new Hono();

  BaseEntity.configure({
    id_generator: new ULIDXIDGeneratorService(),
  });

  const di_container = container();

  app.onError(globalErrorHandler);

  app.get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.route('/api', createRoutes(di_container));

  return app;
}

export type AppType = ReturnType<typeof createServer>;
