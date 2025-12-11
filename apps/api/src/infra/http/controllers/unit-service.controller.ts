import { Context } from 'hono';
import { z } from 'zod';
import type { Container } from '@/infra/di/factory-root';
import { UnitServiceMapper } from '@/application/dtos/mappers/unit-service.mapper';
import { BadRequestError, NotFoundError } from '../errors/http-errors';
import { UnitServiceAlreadyAddedError } from '@/domain/errors/unit-service-already-added.error';
import { ServiceNotFoundError } from '@/domain/errors/service-not-found.error';
import { UnitNotFoundError } from '@/domain/errors/unit-not-found.error';

const AddUnitServiceSchema = z.object({
  service_id: z.string().min(1),
  custom_price_cents: z.number().int().min(0).optional(),
  custom_duration_minutes: z.number().int().positive().optional(),
});

const UpdateUnitServiceSchema = z.object({
  custom_price_cents: z.number().int().min(0).nullable().optional(),
  custom_duration_minutes: z.number().int().positive().nullable().optional(),
  is_active: z.boolean().optional(),
});

export class UnitServiceController {
  constructor(private readonly container: Container) {}

  async add(c: Context) {
    try {
      const { unit_id } = c.req.param();
      const body = await c.req.json();
      const payload = AddUnitServiceSchema.parse(body);

      const unit_service = await this.container.use_cases.add_unit_service.execute({
        unit_id,
        service_id: payload.service_id,
        custom_price_cents: payload.custom_price_cents,
        custom_duration_minutes: payload.custom_duration_minutes,
      });

      return c.json(UnitServiceMapper.toDTO(unit_service), 201);
    } catch (error) {
      if (error instanceof UnitServiceAlreadyAddedError) {
        throw new BadRequestError(error.message);
      }
      if (error instanceof ServiceNotFoundError || error instanceof UnitNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }

  async remove(c: Context) {
    const { unit_id, service_id } = c.req.param();

    const deleted = await this.container.use_cases.remove_unit_service.execute({
      unit_id,
      service_id,
    });

    if (!deleted) {
      throw new NotFoundError('Unit service not found');
    }

    return c.json({ success: true }, 200);
  }

  async update(c: Context) {
    try {
      const { unit_id, service_id } = c.req.param();
      const body = await c.req.json();
      const payload = UpdateUnitServiceSchema.parse(body);

      const unit_service = await this.container.use_cases.update_unit_service_config.execute({
        unit_id,
        service_id,
        custom_price_cents: payload.custom_price_cents,
        custom_duration_minutes: payload.custom_duration_minutes,
        is_active: payload.is_active,
      });

      return c.json(UnitServiceMapper.toDTO(unit_service));
    } catch (error) {
      if (error instanceof ServiceNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }

  async list_by_unit(c: Context) {
    const { unit_id } = c.req.param();
    const cursor = c.req.query('cursor');
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined;

    const result = await this.container.use_cases.get_unit_services.execute({
      unit_id,
      cursor,
      limit,
    });

    // Fetch service and specialty details for each link
    const with_details = await Promise.all(
      result.items.map(async (us) => {
        const service = await this.container.use_cases.get_service_by_id.execute({
          id: us.service_id,
        });
        const specialty = await this.container.use_cases.get_specialty_by_id.execute({
          id: service!.specialty_id,
        });
        return UnitServiceMapper.toWithDetails(us, service!, specialty!);
      })
    );

    return c.json({
      items: with_details,
      next_cursor: result.next_cursor,
      has_more: result.has_more,
    });
  }
}
