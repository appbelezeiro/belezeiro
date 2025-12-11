import { UnitAvailabilityRuleEntity } from '@/domain/entities/units/unit-availability-rule.entity';
import { IUnitAvailabilityRuleRepository } from '@/application/contracts/units/i-unit-availability-rule-repository.interface';

class UseCase {
  constructor(
    private readonly unit_availability_rule_repository: IUnitAvailabilityRuleRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const rule = new UnitAvailabilityRuleEntity({
      unit_id: input.unit_id,
      type: input.type,
      weekday: input.weekday,
      date: input.date,
      start_time: input.start_time,
      end_time: input.end_time,
      slot_duration_minutes: input.slot_duration_minutes,
      is_active: input.is_active,
      metadata: input.metadata,
    });

    return this.unit_availability_rule_repository.create(rule);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    type: 'weekly' | 'specific_date';
    weekday?: number;
    date?: string;
    start_time: string;
    end_time: string;
    slot_duration_minutes: number;
    is_active?: boolean;
    metadata?: Record<string, unknown>;
  };

  export type Output = Promise<UnitAvailabilityRuleEntity>;
}

export { UseCase as CreateUnitAvailabilityRuleUseCase };
