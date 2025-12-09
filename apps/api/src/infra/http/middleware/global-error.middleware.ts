import type { Context } from 'hono';
import type { ErrorHandler } from 'hono';
import { ZodError } from 'zod';

export const globalErrorHandler: ErrorHandler = (err: unknown, c: Context) => {
  const timestamp = new Date().toISOString();
  const path = c.req.path;

  let response: Record<string, unknown> = {
    timestamp,
    path,
  };

  if (err instanceof ZodError) {
    response.error = "VALIDATION_ERROR";
    response.details = err.issues.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return c.json(response, 422);
  }

  response.error = "INTERNAL_SERVER_ERROR";

  return c.json(response, 500);
};
