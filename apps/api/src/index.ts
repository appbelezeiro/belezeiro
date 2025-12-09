import { serve } from '@hono/node-server';
import { createServer } from './infra/http/server';

const app = createServer();

const port = Number(process.env.PORT) || 3000;

console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
