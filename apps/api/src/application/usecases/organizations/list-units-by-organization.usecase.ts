import { UnitEntity } from '@/domain/entities/units/unit.entity';
import { IUnitRepository } from '@/application/contracts/units/i-unit-repository.interface';

class UseCase {
  constructor(private readonly unit_repository: IUnitRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.unit_repository.find_by_organization_id(input.organizationId);
  }
}

declare namespace UseCase {
  export type Input = {
    organizationId: string;
  };

  export type Output = Promise<UnitEntity[]>;
}

export { UseCase as ListUnitsByOrganizationUseCase };
