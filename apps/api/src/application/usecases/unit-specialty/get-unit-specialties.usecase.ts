import { UnitSpecialtyEntity } from '@/domain/entities/unit-specialty.entity';
import { IUnitSpecialtyRepository } from '@/application/contracts/i-unit-specialty-repository.interface';

class UseCase {
  constructor(private readonly unit_specialty_repository: IUnitSpecialtyRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.unit_specialty_repository.list_by_unit(input.unit_id);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
  };

  export type Output = Promise<UnitSpecialtyEntity[]>;
}

export { UseCase as GetUnitSpecialtiesUseCase };
