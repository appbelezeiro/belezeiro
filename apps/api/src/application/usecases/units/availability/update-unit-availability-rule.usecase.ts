import { UnitAvailabilityRuleEntity } from '@/domain/entities/units/unit-availability-rule.entity';
import { IUnitAvailabilityRuleRepository } from '@/application/contracts/units/i-unit-availability-rule-repository.interface';
import { AvailabilityRuleNotFoundError } from '@/domain/errors/units/unit-availability.errors';

class UseCase {
  constructor(
    private readonly unit_availability_rule_repository: IUnitAvailabilityRuleRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const rule = await this.unit_availability_rule_repository.find_by_id(input.id);

    if (!rule) {
      throw new AvailabilityRuleNotFoundError(
        `Unit availability rule ${input.id} not found`
      );
    }

    // Update fields if provided
    if (input.start_time && input.end_time) {
      rule.update_times(input.start_time, input.end_time);
    }

    if (input.slot_duration_minutes) {
      rule.update_slot_duration(input.slot_duration_minutes);
    }

    if (input.is_active !== undefined) {
      input.is_active ? rule.activate() : rule.deactivate();
    }

    if (input.metadata) {
      rule.update_metadata(input.metadata);
    }

    return this.unit_availability_rule_repository.update(rule);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
    start_time?: string;
    end_time?: string;
    slot_duration_minutes?: number;
    is_active?: boolean;
    metadata?: Record<string, unknown>;
  };

  export type Output = Promise<UnitAvailabilityRuleEntity>;
}

export { UseCase as UpdateUnitAvailabilityRuleUseCase };
