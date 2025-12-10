import { UnitEntity } from '@/domain/entities/units/unit.entity';
import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface';

class UseCase {
  constructor(private readonly unit_repository: IUnitRepository) {}

  async execute(): UseCase.Output {
    return this.unit_repository.list_active();
  }
}

declare namespace UseCase {
  export type Output = Promise<UnitEntity[]>;
}

export { UseCase as ListActiveUnitsUseCase };
