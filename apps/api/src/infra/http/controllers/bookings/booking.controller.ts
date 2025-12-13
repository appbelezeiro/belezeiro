import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { BookingNotFoundError } from '@/domain/errors/bookings/booking-not-found.error';
import { BookingOverlapError } from '@/domain/errors/bookings/booking-overlap.error';
import { InvalidTimeRangeError } from '@/domain/errors/bookings/invalid-time-range.error';
import { SlotNotAvailableError } from '@/domain/errors/bookings/slot-not-available.error';
import { BookingInPastError } from '@/domain/errors/bookings/booking-in-past.error';
import { BookingTooCloseError } from '@/domain/errors/bookings/booking-too-close.error';
import { BookingExceedsMaxDurationError } from '@/domain/errors/bookings/booking-exceeds-max-duration.error';
import { BookingInvalidDurationForSlotError } from '@/domain/errors/bookings/booking-invalid-duration-for-slot.error';
import { DailyBookingLimitExceededError } from '@/domain/errors/bookings/daily-booking-limit-exceeded.error';
import { ClientDailyBookingLimitExceededError } from '@/domain/errors/bookings/client-daily-booking-limit-exceeded.error';
import { NotFoundError, BadRequestError, ConflictError } from '../../errors/http-errors';

const CreateBookingSchema = z.object({
  user_id: z.string().min(1),
  client_id: z.string().min(1),
  unit_id: z.string().min(1),
  service_id: z.string().optional(),
  price_cents: z.number().optional(),
  notes: z.string().optional(),
  start_at: z.string().min(1), // ISO timestamp
  end_at: z.string().min(1), // ISO timestamp
});

export class BookingController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateBookingSchema.parse(body);

      const booking = await this.container.use_cases.create_booking.execute({
        user_id: payload.user_id,
        client_id: payload.client_id,
        unit_id: payload.unit_id,
        service_id: payload.service_id,
        price_cents: payload.price_cents,
        notes: payload.notes,
        start_at: payload.start_at,
        end_at: payload.end_at,
      });

      return c.json(
        {
          booking_id: booking.id,
          status: booking.status,
        },
        201,
      );
    } catch (error) {
      // Conflict errors (409)
      if (error instanceof BookingOverlapError) {
        throw new ConflictError(error.message);
      }
      if (error instanceof DailyBookingLimitExceededError) {
        throw new ConflictError(error.message);
      }
      if (error instanceof ClientDailyBookingLimitExceededError) {
        throw new ConflictError(error.message);
      }

      // Bad request errors (400)
      if (error instanceof InvalidTimeRangeError) {
        throw new BadRequestError(error.message);
      }
      if (error instanceof SlotNotAvailableError) {
        throw new BadRequestError(error.message);
      }
      if (error instanceof BookingInPastError) {
        throw new BadRequestError(error.message);
      }
      if (error instanceof BookingTooCloseError) {
        throw new BadRequestError(error.message);
      }
      if (error instanceof BookingExceedsMaxDurationError) {
        throw new BadRequestError(error.message);
      }
      if (error instanceof BookingInvalidDurationForSlotError) {
        throw new BadRequestError(error.message);
      }

      throw error;
    }
  }

  async cancel(c: Context) {
    try {
      const { id } = c.req.param();

      const booking = await this.container.use_cases.cancel_booking.execute({ id });

      return c.json({
        booking_id: booking.id,
        status: booking.status,
      });
    } catch (error) {
      if (error instanceof BookingNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }

  async get_available_days(c: Context) {
    const { user_id, days_ahead } = c.req.query();

    if (!user_id) {
      throw new BadRequestError('user_id query parameter is required');
    }

    const result = await this.container.use_cases.get_available_days.execute({
      user_id,
      days_ahead: days_ahead ? parseInt(days_ahead, 10) : undefined,
    });

    return c.json(result);
  }

  async get_available_slots(c: Context) {
    const { user_id, date } = c.req.query();

    if (!user_id) {
      throw new BadRequestError('user_id query parameter is required');
    }

    if (!date) {
      throw new BadRequestError('date query parameter is required');
    }

    const result = await this.container.use_cases.get_available_slots.execute({
      user_id,
      date,
    });

    return c.json(result);
  }
}
