import { UnitAvailabilityRuleEntity } from '@/domain/entities/units/unit-availability-rule.entity';
import { IUnitAvailabilityRuleRepository } from '@/application/contracts/units/i-unit-availability-rule-repository.interface';

class UseCase {
  constructor(
    private readonly unit_availability_rule_repository: IUnitAvailabilityRuleRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const created_rules: UnitAvailabilityRuleEntity[] = [];

    for (const rule_input of input.rules) {
      const rule = new UnitAvailabilityRuleEntity({
        unit_id: input.unit_id,
        type: rule_input.type,
        weekday: rule_input.weekday,
        date: rule_input.date,
        start_time: rule_input.start_time,
        end_time: rule_input.end_time,
        slot_duration_minutes: rule_input.slot_duration_minutes,
        is_active: rule_input.is_active ?? true,
        metadata: rule_input.metadata,
      });

      const created = await this.unit_availability_rule_repository.create(rule);
      created_rules.push(created);
    }

    return created_rules;
  }
}

declare namespace UseCase {
  export type RuleInput = {
    type: 'weekly' | 'specific_date';
    weekday?: number;
    date?: string;
    start_time: string;
    end_time: string;
    slot_duration_minutes: number;
    is_active?: boolean;
    metadata?: Record<string, unknown>;
  };

  export type Input = {
    unit_id: string;
    rules: RuleInput[];
  };

  export type Output = Promise<UnitAvailabilityRuleEntity[]>;
}

export { UseCase as BulkCreateUnitAvailabilityRulesUseCase };
