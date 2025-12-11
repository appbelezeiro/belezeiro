import { UnitAvailabilityExceptionEntity } from '@/domain/entities/units/unit-availability-exception.entity';
import { IUnitAvailabilityExceptionRepository } from '@/application/contracts/units/i-unit-availability-exception-repository.interface';

class UseCase {
  constructor(
    private readonly unit_availability_exception_repository: IUnitAvailabilityExceptionRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.unit_availability_exception_repository.find_by_unit_id(input.unit_id);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
  };

  export type Output = Promise<UnitAvailabilityExceptionEntity[]>;
}

export { UseCase as GetUnitAvailabilityExceptionsByUnitUseCase };
