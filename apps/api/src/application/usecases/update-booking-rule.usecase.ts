import { BookingRuleEntity } from '@/domain/entities/booking-rule.entity';
import { IBookingRuleRepository } from '@/application/contracts/i-booking-rule-repository.interface';
import { RuleNotFoundError } from '@/domain/errors/rule-not-found.error';
import { InvalidTimeRangeError } from '@/domain/errors/invalid-time-range.error';

class UseCase {
  constructor(private readonly booking_rule_repository: IBookingRuleRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const rule = await this.booking_rule_repository.find_by_id(input.id);

    if (!rule) {
      throw new RuleNotFoundError(`Booking rule with id ${input.id} not found`);
    }

    // Update times if provided
    if (input.start_time && input.end_time) {
      const start = new Date(input.start_time);
      const end = new Date(input.end_time);

      if (start >= end) {
        throw new InvalidTimeRangeError(
          `Start time (${input.start_time}) must be before end time (${input.end_time})`,
        );
      }

      rule.update_times(input.start_time, input.end_time);
    }

    // Update slot duration if provided
    if (input.slot_duration_minutes !== undefined) {
      rule.update_slot_duration(input.slot_duration_minutes);
    }

    // Update metadata if provided
    if (input.metadata !== undefined) {
      rule.update_metadata(input.metadata);
    }

    return this.booking_rule_repository.update(rule);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
    start_time?: string;
    end_time?: string;
    slot_duration_minutes?: number;
    metadata?: Record<string, unknown>;
  };

  export type Output = Promise<BookingRuleEntity>;
}

export { UseCase as UpdateBookingRuleUseCase };
