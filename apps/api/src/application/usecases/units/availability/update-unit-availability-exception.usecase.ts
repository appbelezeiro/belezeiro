import { UnitAvailabilityExceptionEntity } from '@/domain/entities/units/unit-availability-exception.entity';
import { IUnitAvailabilityExceptionRepository } from '@/application/contracts/units/i-unit-availability-exception-repository.interface';
import { AvailabilityExceptionNotFoundError } from '@/domain/errors/units/unit-availability.errors';

class UseCase {
  constructor(
    private readonly unit_availability_exception_repository: IUnitAvailabilityExceptionRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const exception = await this.unit_availability_exception_repository.find_by_id(
      input.id
    );

    if (!exception) {
      throw new AvailabilityExceptionNotFoundError(
        `Unit availability exception ${input.id} not found`
      );
    }

    // Update fields if provided
    if (
      input.start_time &&
      input.end_time &&
      input.slot_duration_minutes &&
      exception.type === 'override'
    ) {
      exception.update_override_times(
        input.start_time,
        input.end_time,
        input.slot_duration_minutes
      );
    }

    if (input.reason) {
      exception.update_reason(input.reason);
    }

    return this.unit_availability_exception_repository.update(exception);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
    start_time?: string;
    end_time?: string;
    slot_duration_minutes?: number;
    reason?: string;
  };

  export type Output = Promise<UnitAvailabilityExceptionEntity>;
}

export { UseCase as UpdateUnitAvailabilityExceptionUseCase };
