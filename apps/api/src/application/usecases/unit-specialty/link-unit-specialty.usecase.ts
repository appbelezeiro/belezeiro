import { UnitSpecialtyEntity } from '@/domain/entities/unit-specialty.entity';
import { IUnitSpecialtyRepository } from '@/application/contracts/i-unit-specialty-repository.interface';
import { ISpecialtyRepository } from '@/application/contracts/i-specialty-repository.interface';
import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface';
import { UnitSpecialtyAlreadyLinkedError } from '@/domain/errors/unit-specialty-already-linked.error';
import { SpecialtyNotFoundError } from '@/domain/errors/specialty-not-found.error';
import { UnitNotFoundError } from '@/domain/errors/units/unit.errors';

class UseCase {
  constructor(
    private readonly unit_specialty_repository: IUnitSpecialtyRepository,
    private readonly specialty_repository: ISpecialtyRepository,
    private readonly unit_repository: IUnitRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // Validate unit exists
    const unit = await this.unit_repository.find_by_id(input.unit_id);
    if (!unit) {
      throw new UnitNotFoundError(`Unit '${input.unit_id}' not found`);
    }

    // Validate specialty exists
    const specialty = await this.specialty_repository.find_by_id(input.specialty_id);
    if (!specialty) {
      throw new SpecialtyNotFoundError(`Specialty '${input.specialty_id}' not found`);
    }

    // Check if already linked
    const existing = await this.unit_specialty_repository.find_by_unit_and_specialty(
      input.unit_id,
      input.specialty_id
    );
    if (existing) {
      throw new UnitSpecialtyAlreadyLinkedError(input.unit_id, input.specialty_id);
    }

    const unit_specialty = new UnitSpecialtyEntity({
      unit_id: input.unit_id,
      specialty_id: input.specialty_id,
    });

    return this.unit_specialty_repository.create(unit_specialty);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    specialty_id: string;
  };

  export type Output = Promise<UnitSpecialtyEntity>;
}

export { UseCase as LinkUnitSpecialtyUseCase };
