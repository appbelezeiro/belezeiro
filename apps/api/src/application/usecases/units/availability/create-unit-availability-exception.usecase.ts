import { UnitAvailabilityExceptionEntity } from '@/domain/entities/units/unit-availability-exception.entity';
import { IUnitAvailabilityExceptionRepository } from '@/application/contracts/units/i-unit-availability-exception-repository.interface';

class UseCase {
  constructor(
    private readonly unit_availability_exception_repository: IUnitAvailabilityExceptionRepository
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const exception = new UnitAvailabilityExceptionEntity({
      unit_id: input.unit_id,
      date: input.date,
      type: input.type,
      start_time: input.start_time,
      end_time: input.end_time,
      slot_duration_minutes: input.slot_duration_minutes,
      reason: input.reason,
    });

    return this.unit_availability_exception_repository.create(exception);
  }
}

declare namespace UseCase {
  export type Input = {
    unit_id: string;
    date: string;
    type: 'block' | 'override';
    start_time?: string;
    end_time?: string;
    slot_duration_minutes?: number;
    reason?: string;
  };

  export type Output = Promise<UnitAvailabilityExceptionEntity>;
}

export { UseCase as CreateUnitAvailabilityExceptionUseCase };
