import { IUnitAvailabilityExceptionRepository } from '@/application/contracts/units/i-unit-availability-exception-repository.interface';
import { AvailabilityExceptionNotFoundError } from '@/domain/errors/units/unit-availability.errors';

class UseCase {
  constructor(
    private readonly unit_availability_exception_repository: IUnitAvailabilityExceptionRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const deleted = await this.unit_availability_exception_repository.delete(input.id);

    if (!deleted) {
      throw new AvailabilityExceptionNotFoundError(
        `Unit availability exception ${input.id} not found`
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

export { UseCase as DeleteUnitAvailabilityExceptionUseCase };
