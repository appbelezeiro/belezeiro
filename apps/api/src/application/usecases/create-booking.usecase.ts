import { BookingEntity } from '@/domain/entities/booking.entity';
import { IBookingRepository } from '@/application/contracts/i-booking-repository.interface';
import { IBookingRuleRepository } from '@/application/contracts/i-booking-rule-repository.interface';
import { IBookingExceptionRepository } from '@/application/contracts/i-booking-exception-repository.interface';
import { InvalidTimeRangeError } from '@/domain/errors/invalid-time-range.error';
import { BookingOverlapError } from '@/domain/errors/booking-overlap.error';
import { SlotNotAvailableError } from '@/domain/errors/slot-not-available.error';
import { DailyBookingLimitExceededError } from '@/domain/errors/daily-booking-limit-exceeded.error';
import { ClientDailyBookingLimitExceededError } from '@/domain/errors/client-daily-booking-limit-exceeded.error';
import { AvailabilityService } from '@/application/services/availability.service';
import { formatDate } from '@/application/utils/date.utils';
import { BookingRuleEntity } from '@/domain/entities/booking-rule.entity';

class UseCase {
  private availability_service: AvailabilityService;

  constructor(
    private readonly booking_repository: IBookingRepository,
    private readonly booking_rule_repository: IBookingRuleRepository,
    private readonly booking_exception_repository: IBookingExceptionRepository,
  ) {
    this.availability_service = new AvailabilityService(
      booking_rule_repository,
      booking_exception_repository,
      booking_repository,
    );
  }

  async execute(input: UseCase.Input): UseCase.Output {
    const start = new Date(input.start_at);
    const end = new Date(input.end_at);
    const date = formatDate(start);

    // 1. Create booking entity
    const booking = new BookingEntity({
      user_id: input.user_id,
      client_id: input.client_id,
      start_at: input.start_at,
      end_at: input.end_at,
    });

    // 2. Validate booking is not in the past
    booking.validate_not_in_past();

    // 3. Validate time range (start < end)
    booking.validate_time_range();

    // 4. Find applicable booking rule for this date/time
    const applicable_rule = await this.find_applicable_rule(input.user_id, start);

    // 5. Validate rule-specific constraints if rule exists
    if (applicable_rule) {
      // 5a. Validate minimum advance time
      if (applicable_rule.min_advance_minutes !== undefined) {
        booking.validate_minimum_advance(applicable_rule.min_advance_minutes);
      }

      // 5b. Validate maximum duration
      if (applicable_rule.max_duration_minutes !== undefined) {
        booking.validate_max_duration(applicable_rule.max_duration_minutes);
      }

      // 5c. Validate booking duration is multiple of slot duration
      booking.validate_is_multiple_of_slot(applicable_rule.slot_duration_minutes);

      // 5d. Validate daily booking limit for user
      if (applicable_rule.max_bookings_per_day !== undefined) {
        const daily_count = await this.booking_repository.count_by_user_and_date(
          input.user_id,
          date,
        );

        if (daily_count >= applicable_rule.max_bookings_per_day) {
          throw new DailyBookingLimitExceededError(
            `Daily booking limit (${applicable_rule.max_bookings_per_day}) exceeded for user ${input.user_id}. Current count: ${daily_count}`,
          );
        }
      }

      // 5e. Validate daily booking limit per client
      if (applicable_rule.max_bookings_per_client_per_day !== undefined) {
        const client_daily_count =
          await this.booking_repository.count_by_client_and_user_and_date(
            input.client_id,
            input.user_id,
            date,
          );

        if (client_daily_count >= applicable_rule.max_bookings_per_client_per_day) {
          throw new ClientDailyBookingLimitExceededError(
            `Daily booking limit (${applicable_rule.max_bookings_per_client_per_day}) exceeded for client ${input.client_id}. Current count: ${client_daily_count}`,
          );
        }
      }
    }

    // 6. Check for overlapping bookings (double-booking protection)
    const overlapping = await this.booking_repository.find_overlapping(
      input.user_id,
      input.start_at,
      input.end_at,
    );

    const confirmed_overlapping = overlapping.filter((b) => b.status === 'confirmed');

    if (confirmed_overlapping.length > 0) {
      throw new BookingOverlapError(
        `Booking conflicts with existing booking ${confirmed_overlapping[0].id}`,
      );
    }

    // 7. Verify slot is available
    const available_slots = await this.availability_service.get_available_slots(
      input.user_id,
      date,
    );

    // Check if requested time falls within any available slot
    const is_available = available_slots.some((slot) => {
      const slot_start = new Date(`${date}T${slot.start}:00.000Z`);
      const slot_end = new Date(`${date}T${slot.end}:00.000Z`);
      return start >= slot_start && end <= slot_end;
    });

    if (!is_available && available_slots.length > 0) {
      throw new SlotNotAvailableError(
        `Requested time slot is not available. Available slots: ${available_slots.map((s) => `${s.start}-${s.end}`).join(', ')}`,
      );
    }

    // 8. Create booking
    return this.booking_repository.create(booking);
  }

  /**
   * Find applicable booking rule for given user and date
   * Priority: specific_date > weekly
   */
  private async find_applicable_rule(
    user_id: string,
    date: Date,
  ): Promise<BookingRuleEntity | null> {
    const date_str = formatDate(date);
    const weekday = date.getUTCDay();

    const all_rules = await this.booking_rule_repository.find_by_user_id(user_id);

    // First, check for specific_date rules
    const specific_rule = all_rules.find(
      (r) => r.type === 'specific_date' && r.date === date_str,
    );

    if (specific_rule) {
      return specific_rule;
    }

    // Then, check for weekly rules
    const weekly_rule = all_rules.find((r) => r.type === 'weekly' && r.weekday === weekday);

    return weekly_rule || null;
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    client_id: string;
    start_at: string; // ISO timestamp
    end_at: string; // ISO timestamp
  };

  export type Output = Promise<BookingEntity>;
}

export { UseCase as CreateBookingUseCase };
