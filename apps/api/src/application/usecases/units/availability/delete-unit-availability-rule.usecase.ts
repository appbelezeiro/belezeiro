import { IUnitAvailabilityRuleRepository } from '@/application/contracts/units/i-unit-availability-rule-repository.interface';
import { AvailabilityRuleNotFoundError } from '@/domain/errors/units/unit-availability.errors';

class UseCase {
  constructor(
    private readonly unit_availability_rule_repository: IUnitAvailabilityRuleRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const deleted = await this.unit_availability_rule_repository.delete(input.id);

    if (!deleted) {
      throw new AvailabilityRuleNotFoundError(
        `Unit availability rule ${input.id} not found`
      );
    }

    return { success: true };
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
  };

  export type Output = Promise<{ success: boolean }>;
}

export { UseCase as DeleteUnitAvailabilityRuleUseCase };
