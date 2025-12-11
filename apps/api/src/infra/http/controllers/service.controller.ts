import { Context } from 'hono';
import { z } from 'zod';
import type { Container } from '@/infra/di/factory-root';
import { ServiceMapper } from '@/application/dtos/mappers/service.mapper';
import { NotFoundError, BadRequestError } from '../errors/http-errors';
import { ServiceCodeAlreadyExistsError } from '@/domain/errors/service-code-already-exists.error';
import { SpecialtyNotFoundError } from '@/domain/errors/specialty-not-found.error';

const CreateServiceSchema = z.object({
  specialty_id: z.string().min(1),
  code: z.string().min(1).max(50).regex(/^[a-z0-9_]+$/),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  default_duration_minutes: z.number().int().positive(),
  default_price_cents: z.number().int().min(0),
});

const UpdateServiceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  default_duration_minutes: z.number().int().positive().optional(),
  default_price_cents: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

export class ServiceController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateServiceSchema.parse(body);

      const service = await this.container.use_cases.create_service.execute(payload);

      return c.json(ServiceMapper.toDTO(service), 201);
    } catch (error) {
      if (error instanceof ServiceCodeAlreadyExistsError) {
        throw new BadRequestError(error.message);
      }
      if (error instanceof SpecialtyNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }

  async list(c: Context) {
    const specialty_id = c.req.query('specialty_id');
    const cursor = c.req.query('cursor');
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined;

    const result = await this.container.use_cases.list_services.execute({
      specialty_id,
      cursor,
      limit,
    });

    return c.json({
      items: result.items.map(ServiceMapper.toDTO),
      next_cursor: result.next_cursor,
      has_more: result.has_more,
    });
  }

  async search(c: Context) {
    const query = c.req.query('q');
    if (!query) {
      throw new BadRequestError('Query parameter "q" is required');
    }

    const specialty_id = c.req.query('specialty_id');
    const cursor = c.req.query('cursor');
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined;

    const result = await this.container.use_cases.search_services.execute({
      query,
      specialty_id,
      cursor,
      limit,
    });

    return c.json({
      items: result.items.map(ServiceMapper.toDTO),
      next_cursor: result.next_cursor,
      has_more: result.has_more,
    });
  }

  async get_by_id(c: Context) {
    const { id } = c.req.param();

    const service = await this.container.use_cases.get_service_by_id.execute({ id });

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    return c.json(ServiceMapper.toDTO(service));
  }

  async update(c: Context) {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const payload = UpdateServiceSchema.parse(body);

      const service = await this.container.use_cases.update_service.execute({
        id,
        ...payload,
      });

      return c.json(ServiceMapper.toDTO(service));
    } catch (error) {
      throw error;
    }
  }

  async delete(c: Context) {
    const { id } = c.req.param();

    await this.container.use_cases.delete_service.execute({ id });

    return c.json({ success: true }, 200);
  }
}
