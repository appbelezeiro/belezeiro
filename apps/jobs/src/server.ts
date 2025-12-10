import { Hono } from 'hono';
import { Logger } from './config/logger';

export function create_server() {
  const app = new Hono();
  const logger = new Logger('JobsServer');

  // Health check
  app.get('/health', (c) => {
    logger.info('Health check requested');

    return c.json({
      status: 'healthy',
      service: 'jobs',
      timestamp: new Date().toISOString(),
    });
  });

  // Metrics endpoint (exemplo)
  app.get('/metrics', (c) => {
    // Em produção, retornar métricas do Prometheus format
    return c.json({
      message: 'Metrics endpoint',
      timestamp: new Date().toISOString(),
    });
  });

  // Status endpoint
  app.get('/', (c) => {
    return c.json({
      service: 'Agenda Jobs & Workers',
      version: '1.0.0',
      description: 'Background job processing for notifications',
      endpoints: {
        health: '/health',
        metrics: '/metrics',
      },
    });
  });

  return app;
}
