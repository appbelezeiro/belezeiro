import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface';
import { IUnitAvailabilityRuleRepository } from '@/application/contracts/units/i-unit-availability-rule-repository.interface';
import { UnitNotFoundError } from '@/domain/errors/units/unit.errors';
import { UnitAvailabilityRuleEntity } from '@/domain/entities/units/unit-availability-rule.entity';

/**
 * @deprecated This usecase was used to migrate legacy workingHours/lunchBreak data.
 * Since these fields no longer exist in UnitEntity, this usecase is deprecated.
 * Availability rules should now be created directly via the availability rule endpoints.
 */
class UseCase {
  constructor(
    private readonly unit_repository: IUnitRepository,
    private readonly unit_availability_rule_repository: IUnitAvailabilityRuleRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // Get the unit (just to validate it exists)
    const unit = await this.unit_repository.find_by_id(input.unit_id);

    if (!unit) {
      throw new UnitNotFoundError(`Unit ${input.unit_id} not found`);
    }

    // The legacy workingHours and lunchBreak fields have been removed from UnitEntity.
    // This usecase is now deprecated. Return empty array.
    console.warn(
      'MigrateUnitToAvailabilityRulesUseCase is deprecated. ' +
        'The legacy workingHours/lunchBreak fields no longer exist. ' +
        'Create availability rules directly via the availability rule endpoints.'
    );

    return [];
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    default_slot_duration_minutes?: number; // Default: 30
  };

  export type Output = Promise<UnitAvailabilityRuleEntity[]>;
}

export { UseCase as MigrateUnitToAvailabilityRulesUseCase };
