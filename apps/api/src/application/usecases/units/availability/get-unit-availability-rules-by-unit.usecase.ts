import { UnitAvailabilityRuleEntity } from '@/domain/entities/units/unit-availability-rule.entity';
import { IUnitAvailabilityRuleRepository } from '@/application/contracts/units/i-unit-availability-rule-repository.interface';

class UseCase {
  constructor(
    private readonly unit_availability_rule_repository: IUnitAvailabilityRuleRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.unit_availability_rule_repository.find_by_unit_id(input.unit_id);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
  };

  export type Output = Promise<UnitAvailabilityRuleEntity[]>;
}

export { UseCase as GetUnitAvailabilityRulesByUnitUseCase };
