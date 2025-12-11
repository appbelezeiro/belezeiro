import { IUnitAvailabilityRuleRepository } from '@/application/contracts/units/i-unit-availability-rule-repository.interface';
import { IUnitAvailabilityExceptionRepository } from '@/application/contracts/units/i-unit-availability-exception-repository.interface';
import {
  TimeInterval,
  Slot,
  getWeekday,
  parseDateTime,
  mergeIntervals,
} from '@/application/utils/date.utils';
import { UnitAvailabilityRuleEntity } from '@/domain/entities/units/unit-availability-rule.entity';

class UseCase {
  constructor(
    private readonly unit_availability_rule_repository: IUnitAvailabilityRuleRepository,
    private readonly unit_availability_exception_repository: IUnitAvailabilityExceptionRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const { unit_id, date } = input;

    // 1. Check for exception block
    const exception = await this.unit_availability_exception_repository.find_by_unit_id_and_date(
      unit_id,
      date
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
            start: parseDateTime(date, exception.start_time),
            end: parseDateTime(date, exception.end_time),
          },
        ];
        slot_duration_minutes = exception.slot_duration_minutes;
      }
    } else {
      // 3. Check for specific_date rules
      const specific_rules = await this.unit_availability_rule_repository.find_by_unit_id_and_date(
        unit_id,
        date
      );

      if (specific_rules.length > 0) {
        // Filter only active rules
        const active_rules = specific_rules.filter((r) => r.is_active);
        intervals = this.rules_to_intervals(active_rules, date);
        slot_duration_minutes = active_rules[0]?.slot_duration_minutes ?? 60;
      } else {
        // 4. Check for weekly rules
        const weekday = getWeekday(date);
        const weekly_rules = await this.unit_availability_rule_repository.find_by_unit_id_and_weekday(
          unit_id,
          weekday
        );

        if (weekly_rules.length > 0) {
          // Filter only active rules
          const active_rules = weekly_rules.filter((r) => r.is_active);
          intervals = this.rules_to_intervals(active_rules, date);
          slot_duration_minutes = active_rules[0]?.slot_duration_minutes ?? 60;
        }
      }
    }

    if (intervals.length === 0) {
      return [];
    }

    // 5. Merge overlapping intervals
    intervals = mergeIntervals(intervals);

    // 6. Generate slots from remaining intervals
    return this.generate_slots_from_intervals(intervals, slot_duration_minutes, date);
  }

  /**
   * Converts availability rules to time intervals for a specific date
   */
  private rules_to_intervals(
    rules: UnitAvailabilityRuleEntity[],
    date: string
  ): TimeInterval[] {
    return rules.map((rule) => ({
      start: parseDateTime(date, rule.start_time),
      end: parseDateTime(date, rule.end_time),
    }));
  }

  /**
   * Generates fixed-duration slots from time intervals
   */
  private generate_slots_from_intervals(
    intervals: TimeInterval[],
    slot_duration_minutes: number,
    date: string
  ): Slot[] {
    const slots: Slot[] = [];

    for (const interval of intervals) {
      const start = new Date(interval.start);
      const end = new Date(interval.end);
      const duration_ms = slot_duration_minutes * 60 * 1000;

      let current = start;

      while (current.getTime() + duration_ms <= end.getTime()) {
        const slot_start = this.extract_time_from_date(current);
        const slot_end_date = new Date(current.getTime() + duration_ms);
        const slot_end = this.extract_time_from_date(slot_end_date);

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
   * Extracts HH:MM from Date object
   */
  private extract_time_from_date(date: Date): string {
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    date: string; // YYYY-MM-DD
  };

  export type Output = Promise<Slot[]>;
}

export { UseCase as GetUnitAvailableSlotsUseCase };
