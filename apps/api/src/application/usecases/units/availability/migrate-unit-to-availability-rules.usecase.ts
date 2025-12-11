import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface';
import { IUnitAvailabilityRuleRepository } from '@/application/contracts/units/i-unit-availability-rule-repository.interface';
import { UnitNotFoundError } from '@/domain/errors/units/unit.errors';
import { UnitAvailabilityRuleEntity } from '@/domain/entities/units/unit-availability-rule.entity';

class UseCase {
  constructor(
    private readonly unit_repository: IUnitRepository,
    private readonly unit_availability_rule_repository: IUnitAvailabilityRuleRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // Get the unit
    const unit = await this.unit_repository.find_by_id(input.unit_id);

    if (!unit) {
      throw new UnitNotFoundError(`Unit ${input.unit_id} not found`);
    }

    const created_rules: UnitAvailabilityRuleEntity[] = [];

    // Get working hours from unit
    const working_hours = unit.get('workingHours');

    if (!working_hours) {
      return created_rules;
    }

    // Default slot duration
    const slot_duration_minutes = input.default_slot_duration_minutes || 30;

    // Map day names to weekday numbers (0 = Sunday, 1 = Monday, etc.)
    const day_to_weekday: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    // Create availability rules for each day
    for (const [day_name, day_schedule] of Object.entries(working_hours)) {
      // Skip if day is not enabled
      if (!day_schedule.enabled) {
        continue;
      }

      const weekday = day_to_weekday[day_name];

      if (weekday === undefined) {
        console.warn(`Unknown day name: ${day_name}`);
        continue;
      }

      // Create rule for this day
      const rule = new UnitAvailabilityRuleEntity({
        unit_id: unit.id,
        type: 'weekly',
        weekday,
        start_time: day_schedule.open,
        end_time: day_schedule.close,
        slot_duration_minutes,
        is_active: true,
        metadata: {
          migrated_from: 'workingHours',
          original_day: day_name,
        },
      });

      const created = await this.unit_availability_rule_repository.create(rule);
      created_rules.push(created);
    }

    // Handle lunch break if exists
    const lunch_break = unit.get('lunchBreak');

    if (lunch_break?.enabled) {
      // Create exceptions for lunch break on each working day
      // Note: This would require the availability exception repository as well
      // For now, we'll just log this - you can extend this to create exceptions
      console.log('Lunch break detected but exception creation not implemented in this use case');
      // TODO: Optionally create lunch break exceptions
    }

    return created_rules;
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
