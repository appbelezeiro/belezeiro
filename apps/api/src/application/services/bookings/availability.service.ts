import { IBookingRuleRepository } from '@/application/contracts/bookings/i-booking-rule-repository.interface';
import { IBookingExceptionRepository } from '@/application/contracts/bookings/i-booking-exception-repository.interface';
import { IBookingRepository } from '@/application/contracts/bookings/i-booking-repository.interface';
import {
  TimeInterval,
  Slot,
  formatDate,
  getWeekday,
  addDays,
  parseDateTime,
  extractTime,
  mergeIntervals,
  subtractIntervals,
} from '@/application/utils/date.utils';
import { BookingRuleEntity } from '@/domain/entities/bookings/booking-rule.entity';
import { BookingExceptionEntity } from '@/domain/entities/bookings/booking-exception.entity';
import { BookingEntity } from '@/domain/entities/bookings/booking.entity';

export class AvailabilityService {
  constructor(
    private readonly booking_rule_repository: IBookingRuleRepository,
    private readonly booking_exception_repository: IBookingExceptionRepository,
    private readonly booking_repository: IBookingRepository,
  ) {}

  /**
   * Returns array of dates (YYYY-MM-DD) that have any availability
   * Priority: exception block > exception override > specific_date rule > weekly rule
   */
  async get_available_days(user_id: string, days_ahead: number): Promise<string[]> {
    const today = formatDate(new Date());
    const available_days: string[] = [];

    for (let i = 0; i < days_ahead; i++) {
      const date = addDays(today, i);
      const slots = await this.get_available_slots(user_id, date);

      if (slots.length > 0) {
        available_days.push(date);
      }
    }

    return available_days;
  }

  /**
   * Returns available slots for a specific date
   * Applies priority rules and subtracts existing bookings
   */
  async get_available_slots(user_id: string, date: string): Promise<Slot[]> {
    // 1. Check for exception block
    const exception = await this.booking_exception_repository.find_by_user_id_and_date(
      user_id,
      date,
    );

    if (exception && exception.type === 'block') {
      return []; // Day is completely blocked
    }

    let intervals: TimeInterval[] = [];
    let slot_duration_minutes = 60; // default

    // 2. Check for exception override
    if (exception && exception.type === 'override') {
      if (exception.start_time && exception.end_time && exception.slot_duration_minutes) {
        intervals = [
          {
            start: parseDateTime(date, extractTime(exception.start_time)),
            end: parseDateTime(date, extractTime(exception.end_time)),
          },
        ];
        slot_duration_minutes = exception.slot_duration_minutes;
      }
    } else {
      // 3. Check for specific_date rules
      const specific_rules = await this.booking_rule_repository.find_by_user_id_and_date(
        user_id,
        date,
      );

      if (specific_rules.length > 0) {
        intervals = this.rules_to_intervals(specific_rules, date);
        slot_duration_minutes = specific_rules[0].slot_duration_minutes;
      } else {
        // 4. Check for weekly rules
        const weekday = getWeekday(date);
        const weekly_rules = await this.booking_rule_repository.find_weekly_by_weekday(
          user_id,
          weekday,
        );

        if (weekly_rules.length > 0) {
          intervals = this.rules_to_intervals(weekly_rules, date);
          slot_duration_minutes = weekly_rules[0].slot_duration_minutes;
        }
      }
    }

    if (intervals.length === 0) {
      return [];
    }

    // 5. Merge overlapping intervals
    intervals = mergeIntervals(intervals);

    // 6. Subtract existing bookings
    const start_of_day = parseDateTime(date, '00:00');
    const end_of_day = parseDateTime(date, '23:59');
    const bookings = await this.booking_repository.find_by_user_id_and_date_range(
      user_id,
      start_of_day,
      end_of_day,
    );

    // Only consider confirmed bookings
    const confirmed_bookings = bookings.filter((b) => b.status === 'confirmed');
    intervals = this.subtract_bookings_from_intervals(intervals, confirmed_bookings);

    // 7. Generate slots from remaining intervals
    return this.generate_slots_from_intervals(intervals, slot_duration_minutes);
  }

  /**
   * Converts booking rules to time intervals for a specific date
   */
  private rules_to_intervals(rules: BookingRuleEntity[], date: string): TimeInterval[] {
    return rules.map((rule) => ({
      start: parseDateTime(date, extractTime(rule.start_time)),
      end: parseDateTime(date, extractTime(rule.end_time)),
    }));
  }

  /**
   * Subtracts booked time from available intervals
   */
  private subtract_bookings_from_intervals(
    intervals: TimeInterval[],
    bookings: BookingEntity[],
  ): TimeInterval[] {
    let remaining = [...intervals];

    for (const booking of bookings) {
      const booking_interval: TimeInterval = {
        start: booking.start_at,
        end: booking.end_at,
      };

      const new_remaining: TimeInterval[] = [];
      for (const interval of remaining) {
        new_remaining.push(...subtractIntervals(interval, [booking_interval]));
      }
      remaining = new_remaining;
    }

    return remaining;
  }

  /**
   * Generates fixed-duration slots from time intervals
   */
  private generate_slots_from_intervals(
    intervals: TimeInterval[],
    slot_duration_minutes: number,
  ): Slot[] {
    const slots: Slot[] = [];

    for (const interval of intervals) {
      const start = new Date(interval.start);
      const end = new Date(interval.end);
      const duration_ms = slot_duration_minutes * 60 * 1000;

      let current = start;

      while (current.getTime() + duration_ms <= end.getTime()) {
        const slot_start = extractTime(current.toISOString());
        const slot_end_date = new Date(current.getTime() + duration_ms);
        const slot_end = extractTime(slot_end_date.toISOString());

        slots.push({
          start: slot_start,
          end: slot_end,
        });

        current = slot_end_date;
      }
    }

    return slots;
  }

  /**
   * Public method to generate slots from intervals (for use cases)
   */
  generate_slots(intervals: TimeInterval[], slot_duration_minutes: number): Slot[] {
    return this.generate_slots_from_intervals(intervals, slot_duration_minutes);
  }

  /**
   * Public method to merge intervals (for use cases)
   */
  merge_intervals(intervals: TimeInterval[]): TimeInterval[] {
    return mergeIntervals(intervals);
  }
}
