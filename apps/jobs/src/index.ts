import { serve } from '@hono/node-server';
import { create_server } from './server';
import { Logger } from './config/logger';

const PORT = parseInt(process.env.PORT || '3001', 10);
const logger = new Logger('Main');

const app = create_server();

logger.info('Starting Jobs server', {
  port: PORT,
  environment: process.env.NODE_ENV || 'development',
});

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    logger.info('Jobs server listening', {
      address: info.address,
      port: info.port,
    });
  }
);

export default app;
