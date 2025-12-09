import { ScheduleExceptionEntity } from '@/domain/entities/schedule-exception.entity';

export interface IScheduleExceptionRepository {
  create(exception: ScheduleExceptionEntity): Promise<ScheduleExceptionEntity>;
  find_by_id(id: string): Promise<ScheduleExceptionEntity | null>;
  list_by_user(user_id: string): Promise<ScheduleExceptionEntity[]>;
  list_by_user_and_date(user_id: string, date: Date): Promise<ScheduleExceptionEntity[]>;
  list_by_user_and_date_range(
    user_id: string,
    start_date: Date,
    end_date: Date,
  ): Promise<ScheduleExceptionEntity[]>;
  update(exception: ScheduleExceptionEntity): Promise<ScheduleExceptionEntity>;
  delete(id: string): Promise<boolean>;
}
