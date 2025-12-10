import { UnitEntity } from '@/domain/entities/unit.entity';
import { IUnitRepository } from '@/application/contracts/i-unit-repository.interface';

class UseCase {
  constructor(private readonly unit_repository: IUnitRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.unit_repository.find_by_id(input.id);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
  };

  export type Output = Promise<UnitEntity | null>;
}

export { UseCase as GetUnitByIdUseCase };
