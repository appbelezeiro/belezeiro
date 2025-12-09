import { ScheduleExceptionEntity, ScheduleExceptionType } from '@/domain/entities/schedule-exception.entity';
import { IScheduleExceptionRepository } from '@/application/contracts/i-schedule-exception-repository.interface';

class UseCase {
  constructor(private readonly schedule_exception_repository: IScheduleExceptionRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const exception = new ScheduleExceptionEntity({
      user_id: input.user_id,
      date: input.date,
      type: input.type,
      start_time: input.start_time,
      end_time: input.end_time,
      reason: input.reason,
    });

    return this.schedule_exception_repository.create(exception);
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    date: Date;
    type: ScheduleExceptionType;
    start_time?: string;
    end_time?: string;
    reason?: string;
  };

  export type Output = Promise<ScheduleExceptionEntity>;
}

export { UseCase as CreateScheduleExceptionUseCase };
