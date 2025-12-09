import { ScheduleExceptionEntity } from '@/domain/entities/schedule-exception.entity';
import { IScheduleExceptionRepository } from '@/application/contracts/i-schedule-exception-repository.interface';

class UseCase {
  constructor(private readonly schedule_exception_repository: IScheduleExceptionRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    if (input.date) {
      return this.schedule_exception_repository.list_by_user_and_date(input.user_id, input.date);
    }

    if (input.start_date && input.end_date) {
      return this.schedule_exception_repository.list_by_user_and_date_range(
        input.user_id,
        input.start_date,
        input.end_date
      );
    }

    return this.schedule_exception_repository.list_by_user(input.user_id);
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    date?: Date;
    start_date?: Date;
    end_date?: Date;
  };

  export type Output = Promise<ScheduleExceptionEntity[]>;
}

export { UseCase as GetScheduleExceptionsByUserUseCase };
