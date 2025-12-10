import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { BookingExceptionMapper } from '@/application/dtos/mappers/bookings/booking-exception.mapper';
import { ExceptionNotFoundError } from '@/domain/errors/bookings/exception-not-found.error';
import { InvalidTimeRangeError } from '@/domain/errors/bookings/invalid-time-range.error';
import { NotFoundError, BadRequestError } from '../../errors/http-errors';

const CreateBookingExceptionSchema = z.object({
  user_id: z.string().min(1),
  date: z.string().min(1), // YYYY-MM-DD
  type: z.enum(['block', 'override']),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  slot_duration_minutes: z.number().positive().optional(),
  reason: z.string().optional(),
});

const UpdateBookingExceptionSchema = z.object({
  start_time: z.string().min(1).optional(),
  end_time: z.string().min(1).optional(),
  slot_duration_minutes: z.number().positive().optional(),
  reason: z.string().optional(),
});

export class BookingExceptionController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateBookingExceptionSchema.parse(body);

      const exception = await this.container.use_cases.create_booking_exception.execute({
        user_id: payload.user_id,
        date: payload.date,
        type: payload.type,
        start_time: payload.start_time,
        end_time: payload.end_time,
        slot_duration_minutes: payload.slot_duration_minutes,
        reason: payload.reason,
      });

      return c.json(BookingExceptionMapper.toDTO(exception), 201);
    } catch (error) {
      if (error instanceof InvalidTimeRangeError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async list(c: Context) {
    const { user_id, date } = c.req.query();

    if (!user_id) {
      throw new BadRequestError('user_id query parameter is required');
    }

    const exceptions = await this.container.use_cases.get_booking_exceptions_by_user.execute({
      user_id,
      date,
    });

    return c.json({
      items: BookingExceptionMapper.toListItemList(exceptions),
      total: exceptions.length,
    });
  }

  async update(c: Context) {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const payload = UpdateBookingExceptionSchema.parse(body);

      const exception = await this.container.use_cases.update_booking_exception.execute({
        id,
        ...payload,
      });

      return c.json(BookingExceptionMapper.toDTO(exception));
    } catch (error) {
      if (error instanceof ExceptionNotFoundError) {
        throw new NotFoundError(error.message);
      }
      if (error instanceof InvalidTimeRangeError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async delete(c: Context) {
    try {
      const { id } = c.req.param();

      await this.container.use_cases.delete_booking_exception.execute({ id });

      return c.body(null, 204);
    } catch (error) {
      if (error instanceof ExceptionNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }
}
