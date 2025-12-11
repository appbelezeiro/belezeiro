import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { UnitAvailabilityExceptionMapper } from '@/application/dtos/mappers/units/unit-availability-exception.mapper';
import {
  AvailabilityExceptionNotFoundError,
  InvalidAvailabilityExceptionError,
} from '@/domain/errors/units/unit-availability.errors';
import { NotFoundError, BadRequestError } from '../../errors/http-errors';

const CreateUnitAvailabilityExceptionSchema = z.object({
  unit_id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(['block', 'override']),
  start_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  end_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  slot_duration_minutes: z.number().positive().optional(),
  reason: z.string().optional(),
});

const BulkCreateUnitAvailabilityExceptionsSchema = z.object({
  unit_id: z.string().min(1),
  exceptions: z.array(CreateUnitAvailabilityExceptionSchema.omit({ unit_id: true })),
});

const UpdateUnitAvailabilityExceptionSchema = z.object({
  start_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  end_time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  slot_duration_minutes: z.number().positive().optional(),
  reason: z.string().optional(),
});

export class UnitAvailabilityExceptionController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateUnitAvailabilityExceptionSchema.parse(body);

      const exception = await this.container.use_cases.create_unit_availability_exception.execute(
        {
          unit_id: payload.unit_id,
          date: payload.date,
          type: payload.type,
          start_time: payload.start_time,
          end_time: payload.end_time,
          slot_duration_minutes: payload.slot_duration_minutes,
          reason: payload.reason,
        }
      );

      return c.json(UnitAvailabilityExceptionMapper.toDTO(exception), 201);
    } catch (error) {
      if (error instanceof InvalidAvailabilityExceptionError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async bulk_create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = BulkCreateUnitAvailabilityExceptionsSchema.parse(body);

      const exceptions = await this.container.use_cases.bulk_create_unit_availability_exceptions.execute(
        {
          unit_id: payload.unit_id,
          exceptions: payload.exceptions,
        }
      );

      return c.json(
        {
          items: UnitAvailabilityExceptionMapper.toDTOList(exceptions),
          total: exceptions.length,
        },
        201
      );
    } catch (error) {
      if (error instanceof InvalidAvailabilityExceptionError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async list_by_unit(c: Context) {
    const { unit_id } = c.req.param();

    const exceptions = await this.container.use_cases.get_unit_availability_exceptions_by_unit.execute(
      {
        unit_id,
      }
    );

    return c.json({
      items: UnitAvailabilityExceptionMapper.toListItemList(exceptions),
      total: exceptions.length,
    });
  }

  async update(c: Context) {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const payload = UpdateUnitAvailabilityExceptionSchema.parse(body);

      const exception = await this.container.use_cases.update_unit_availability_exception.execute(
        {
          id,
          ...payload,
        }
      );

      return c.json(UnitAvailabilityExceptionMapper.toDTO(exception));
    } catch (error) {
      if (error instanceof AvailabilityExceptionNotFoundError) {
        throw new NotFoundError(error.message);
      }
      if (error instanceof InvalidAvailabilityExceptionError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async delete(c: Context) {
    try {
      const { id } = c.req.param();

      await this.container.use_cases.delete_unit_availability_exception.execute({ id });

      return c.body(null, 204);
    } catch (error) {
      if (error instanceof AvailabilityExceptionNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }
}
