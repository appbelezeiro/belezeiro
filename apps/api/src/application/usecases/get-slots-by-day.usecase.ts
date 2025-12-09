import { IScheduleRepository } from '@/application/contracts/i-schedule-repository.interface';

class UseCase {
  constructor(private readonly schedule_repository: IScheduleRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.schedule_repository.get_slots_by_day(input.user_id, input.date);
  }
}

declare namespace UseCase {
  interface Slot {
    time: string;
  }

  export type Input = {
    user_id: string;
    date: Date;
  };
  export type Output = Promise<Slot[]>;
}

export { UseCase as GetSlotsByDayUseCase };