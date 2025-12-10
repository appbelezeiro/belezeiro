import type { Context } from 'hono';
import type { ErrorHandler } from 'hono';
import { ZodError } from 'zod';
import { HttpError } from '../errors/http-errors';

export const globalErrorHandler: ErrorHandler = (err: unknown, c: Context) => {
  const timestamp = new Date().toISOString();
  const path = c.req.path;

  let response: Record<string, unknown> = {
    timestamp,
    path,
  };

  // Zod validation errors
  if (err instanceof ZodError) {
    response.error = 'VALIDATION_ERROR';
    response.details = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return c.json(response, 422);
  }

  // Custom HTTP errors
  if (err instanceof HttpError) {
    response.error = err.code || err.name;
    response.message = err.message;
    if (err.details) {
      response.details = err.details;
    }
    return c.json(response, err.statusCode as any);
  }

  // Unknown errors
  response.error = 'INTERNAL_SERVER_ERROR';
  response.message = 'An unexpected error occurred';

  // Log error (em produção, enviar para serviço de logging)
  console.error('Unhandled error:', err);

  return c.json(response, 500);
};
