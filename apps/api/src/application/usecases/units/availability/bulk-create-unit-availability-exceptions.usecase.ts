import { UnitAvailabilityExceptionEntity } from '@/domain/entities/units/unit-availability-exception.entity';
import { IUnitAvailabilityExceptionRepository } from '@/application/contracts/units/i-unit-availability-exception-repository.interface';

class UseCase {
  constructor(
    private readonly unit_availability_exception_repository: IUnitAvailabilityExceptionRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const created_exceptions: UnitAvailabilityExceptionEntity[] = [];

    for (const exception_input of input.exceptions) {
      const exception = new UnitAvailabilityExceptionEntity({
        unit_id: input.unit_id,
        date: exception_input.date,
        type: exception_input.type,
        start_time: exception_input.start_time,
        end_time: exception_input.end_time,
        slot_duration_minutes: exception_input.slot_duration_minutes,
        reason: exception_input.reason,
      });

      const created = await this.unit_availability_exception_repository.create(exception);
      created_exceptions.push(created);
    }

    return created_exceptions;
  }
}

declare namespace UseCase {
  export type ExceptionInput = {
    date: string;
    type: 'block' | 'override';
    start_time?: string;
    end_time?: string;
    slot_duration_minutes?: number;
    reason?: string;
  };

  export type Input = {
    unit_id: string;
    exceptions: ExceptionInput[];
  };

  export type Output = Promise<UnitAvailabilityExceptionEntity[]>;
}

export { UseCase as BulkCreateUnitAvailabilityExceptionsUseCase };
