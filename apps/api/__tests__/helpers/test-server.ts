import request from 'supertest';
import { createServer } from '@/infra/http/server';
import type { IncomingMessage, ServerResponse } from 'node:http';

export function createTestServer() {
  const app = createServer();

  const handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    let body: string | undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      body = Buffer.concat(chunks).toString();
    }

    const webRequest = new Request(url.toString(), {
      method: req.method,
      headers: req.headers as any,
      body: body && body.length > 0 ? body : undefined,
    });

    try {
      const webResponse = await app.fetch(webRequest);

      res.statusCode = webResponse.status;
      webResponse.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      const responseBody = await webResponse.text();
      res.end(responseBody);
    } catch (err) {
      res.statusCode = 500;
      res.end(err instanceof Error ? err.message : 'Internal server error');
    }
  };

  return request(handleRequest);
}
