import { Context } from 'hono';
import { z } from 'zod';
import type { Container } from '@/infra/di/factory-root';
import { AmenityMapper } from '@/application/dtos/mappers/amenity.mapper';
import { NotFoundError, BadRequestError } from '../errors/http-errors';
import { AmenityCodeAlreadyExistsError } from '@/domain/errors/amenity-code-already-exists.error';
import { AmenityNotFoundError } from '@/domain/errors/amenity-not-found.error';

const CreateAmenitySchema = z.object({
  code: z.string().min(1).max(50).regex(/^[a-z0-9_]+$/),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().min(1).max(50),
});

const UpdateAmenitySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  icon: z.string().min(1).max(50).optional(),
});

const SeedAmenitiesSchema = z.object({
  seeds: z.array(
    z.object({
      code: z.string(),
      name: z.string(),
      description: z.string().optional(),
      icon: z.string(),
    })
  ),
});

export class AmenityController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateAmenitySchema.parse(body);

      const amenity = await this.container.use_cases.create_amenity.execute({
        code: payload.code,
        name: payload.name,
        description: payload.description,
        icon: payload.icon,
      });

      return c.json(AmenityMapper.toDTO(amenity), 201);
    } catch (error) {
      if (error instanceof AmenityCodeAlreadyExistsError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async list(c: Context) {
    const cursor = c.req.query('cursor');
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined;

    const result = await this.container.use_cases.list_amenities.execute({
      cursor,
      limit,
    });

    return c.json({
      items: result.items.map(AmenityMapper.toDTO),
      next_cursor: result.next_cursor,
      has_more: result.has_more,
    });
  }

  async search(c: Context) {
    const query = c.req.query('q');
    if (!query) {
      throw new BadRequestError('Query parameter "q" is required');
    }

    const cursor = c.req.query('cursor');
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined;

    const result = await this.container.use_cases.search_amenities.execute({
      query,
      cursor,
      limit,
    });

    return c.json({
      items: result.items.map(AmenityMapper.toDTO),
      next_cursor: result.next_cursor,
      has_more: result.has_more,
    });
  }

  async get_by_id(c: Context) {
    const { id } = c.req.param();

    const amenity = await this.container.use_cases.get_amenity_by_id.execute({ id });

    if (!amenity) {
      throw new NotFoundError('Amenity not found');
    }

    return c.json(AmenityMapper.toDTO(amenity));
  }

  async update(c: Context) {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const payload = UpdateAmenitySchema.parse(body);

      const amenity = await this.container.use_cases.update_amenity.execute({
        id,
        ...payload,
      });

      return c.json(AmenityMapper.toDTO(amenity));
    } catch (error) {
      if (error instanceof AmenityNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }

  async activate(c: Context) {
    try {
      const { id } = c.req.param();

      const amenity = await this.container.use_cases.activate_amenity.execute({ id });

      return c.json(AmenityMapper.toDTO(amenity));
    } catch (error) {
      if (error instanceof AmenityNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }

  async deactivate(c: Context) {
    try {
      const { id } = c.req.param();

      const amenity = await this.container.use_cases.deactivate_amenity.execute({ id });

      return c.json(AmenityMapper.toDTO(amenity));
    } catch (error) {
      if (error instanceof AmenityNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }

  async seed(c: Context) {
    const body = await c.req.json();
    const payload = SeedAmenitiesSchema.parse(body);

    const amenities = await this.container.use_cases.seed_amenities.execute({
      seeds: payload.seeds,
    });

    return c.json({
      items: amenities.map(AmenityMapper.toDTO),
      count: amenities.length,
    });
  }
}
