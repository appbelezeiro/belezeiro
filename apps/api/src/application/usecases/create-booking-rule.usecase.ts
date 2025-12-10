import { BookingRuleEntity } from '@/domain/entities/booking-rule.entity';
import { IBookingRuleRepository } from '@/application/contracts/i-booking-rule-repository.interface';
import { InvalidTimeRangeError } from '@/domain/errors/invalid-time-range.error';

class UseCase {
  constructor(private readonly booking_rule_repository: IBookingRuleRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // Validate time range
    const start = new Date(input.start_time);
    const end = new Date(input.end_time);

    if (start >= end) {
      throw new InvalidTimeRangeError(
        `Start time (${input.start_time}) must be before end time (${input.end_time})`,
      );
    }

    // Validate type-specific fields
    if (input.type === 'weekly' && input.weekday === undefined) {
      throw new InvalidTimeRangeError('Weekday is required for weekly rules');
    }

    if (input.type === 'specific_date' && !input.date) {
      throw new InvalidTimeRangeError('Date is required for specific_date rules');
    }

    const rule = new BookingRuleEntity({
      user_id: input.user_id,
      type: input.type,
      weekday: input.weekday,
      date: input.date,
      start_time: input.start_time,
      end_time: input.end_time,
      slot_duration_minutes: input.slot_duration_minutes,
      min_advance_minutes: input.min_advance_minutes,
      max_duration_minutes: input.max_duration_minutes,
      max_bookings_per_day: input.max_bookings_per_day,
      max_bookings_per_client_per_day: input.max_bookings_per_client_per_day,
      metadata: input.metadata,
    });

    return this.booking_rule_repository.create(rule);
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    type: 'weekly' | 'specific_date';
    weekday?: number;
    date?: string;
    start_time: string;
    end_time: string;
    slot_duration_minutes: number;
    min_advance_minutes?: number;
    max_duration_minutes?: number;
    max_bookings_per_day?: number;
    max_bookings_per_client_per_day?: number;
    metadata?: Record<string, unknown>;
  };

  export type Output = Promise<BookingRuleEntity>;
}

export { UseCase as CreateBookingRuleUseCase };
