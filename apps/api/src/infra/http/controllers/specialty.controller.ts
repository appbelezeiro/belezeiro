import { Context } from 'hono';
import { z } from 'zod';
import type { Container } from '@/infra/di/factory-root';
import { SpecialtyMapper } from '@/application/dtos/mappers/specialty.mapper';
import { NotFoundError, BadRequestError } from '../errors/http-errors';
import { SpecialtyCodeAlreadyExistsError } from '@/domain/errors/specialty-code-already-exists.error';

const CreateSpecialtySchema = z.object({
  code: z.string().min(1).max(50).regex(/^[a-z0-9_]+$/),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().min(1).max(10),
});

export class SpecialtyController {
  constructor(private readonly container: Container) { }

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateSpecialtySchema.parse(body);

      const specialty = await this.container.use_cases.create_specialty.execute({
        code: payload.code,
        name: payload.name,
        description: payload.description,
        icon: payload.icon,
      });

      return c.json(SpecialtyMapper.toDTO(specialty), 201);
    } catch (error) {
      if (error instanceof SpecialtyCodeAlreadyExistsError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async list(c: Context) {
    const cursor = c.req.query('c');
    const query = c.req.query('q');
    const limit = c.req.query('l') ? parseInt(c.req.query('l')!) : undefined;

    const result = await this.container.use_cases.list_specialties.execute({
      query,
      cursor,
      limit,
    });

    return c.json({
      items: result.items.map(SpecialtyMapper.toDTO),
      next_cursor: result.next_cursor,
      has_more: result.has_more,
    });
  }

  async get_by_id(c: Context) {
    const { id } = c.req.param();

    const specialty = await this.container.use_cases.get_specialty_by_id.execute({ id });

    if (!specialty) {
      throw new NotFoundError('Specialty not found');
    }

    return c.json(SpecialtyMapper.toDTO(specialty));
  }
}
