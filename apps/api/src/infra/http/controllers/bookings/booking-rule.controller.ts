import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { BookingRuleMapper } from '@/application/dtos/mappers/bookings/booking-rule.mapper';
import { RuleNotFoundError } from '@/domain/errors/bookings/rule-not-found.error';
import { InvalidTimeRangeError } from '@/domain/errors/bookings/invalid-time-range.error';
import { NotFoundError, BadRequestError } from '../../errors/http-errors';

const CreateBookingRuleSchema = z.object({
  user_id: z.string().min(1),
  type: z.enum(['weekly', 'specific_date']),
  weekday: z.number().min(0).max(6).optional(),
  date: z.string().optional(),
  start_time: z.string().min(1),
  end_time: z.string().min(1),
  slot_duration_minutes: z.number().positive(),
  min_advance_minutes: z.number().nonnegative().optional(),
  max_duration_minutes: z.number().positive().optional(),
  max_bookings_per_day: z.number().positive().int().optional(),
  max_bookings_per_client_per_day: z.number().positive().int().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateBookingRuleSchema = z.object({
  start_time: z.string().min(1).optional(),
  end_time: z.string().min(1).optional(),
  slot_duration_minutes: z.number().positive().optional(),
  min_advance_minutes: z.number().nonnegative().optional(),
  max_duration_minutes: z.number().positive().optional(),
  max_bookings_per_day: z.number().positive().int().optional(),
  max_bookings_per_client_per_day: z.number().positive().int().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export class BookingRuleController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateBookingRuleSchema.parse(body);

      const rule = await this.container.use_cases.create_booking_rule.execute({
        user_id: payload.user_id,
        type: payload.type,
        weekday: payload.weekday,
        date: payload.date,
        start_time: payload.start_time,
        end_time: payload.end_time,
        slot_duration_minutes: payload.slot_duration_minutes,
        min_advance_minutes: payload.min_advance_minutes,
        max_duration_minutes: payload.max_duration_minutes,
        max_bookings_per_day: payload.max_bookings_per_day,
        max_bookings_per_client_per_day: payload.max_bookings_per_client_per_day,
        metadata: payload.metadata,
      });

      return c.json(BookingRuleMapper.toDTO(rule), 201);
    } catch (error) {
      if (error instanceof InvalidTimeRangeError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  async list(c: Context) {
    const { user_id } = c.req.query();

    if (!user_id) {
      throw new BadRequestError('user_id query parameter is required');
    }

    const rules = await this.container.use_cases.get_booking_rules_by_user.execute({
      user_id,
    });

    return c.json({
      items: BookingRuleMapper.toListItemList(rules),
      total: rules.length,
    });
  }

  async update(c: Context) {
    try {
      const { id } = c.req.param();
      const body = await c.req.json();
      const payload = UpdateBookingRuleSchema.parse(body);

      const rule = await this.container.use_cases.update_booking_rule.execute({
        id,
        ...payload,
      });

      return c.json(BookingRuleMapper.toDTO(rule));
    } catch (error) {
      if (error instanceof RuleNotFoundError) {
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

      await this.container.use_cases.delete_booking_rule.execute({ id });

      return c.json({ success: true }, 204);
    } catch (error) {
      if (error instanceof RuleNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }
}
