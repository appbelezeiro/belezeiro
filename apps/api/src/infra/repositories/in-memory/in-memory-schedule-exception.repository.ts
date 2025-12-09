import { ScheduleExceptionEntity } from '@/domain/entities/schedule-exception.entity';
import { IScheduleExceptionRepository } from '@/application/contracts/i-schedule-exception-repository.interface';
import { ScheduleExceptionDataMapper, ScheduleExceptionPersistence } from './data-mappers/schedule-exception.data-mapper';

export class InMemoryScheduleExceptionRepository implements IScheduleExceptionRepository {
  private exceptions: ScheduleExceptionPersistence[] = [];

  async create(exception: ScheduleExceptionEntity): Promise<ScheduleExceptionEntity> {
    const persistence = ScheduleExceptionDataMapper.toPersistence(exception);
    this.exceptions.push(persistence);
    return ScheduleExceptionDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<ScheduleExceptionEntity | null> {
    const exception = this.exceptions.find((e) => e.id === id);
    return exception ? ScheduleExceptionDataMapper.toDomain(exception) : null;
  }

  async list_by_user(user_id: string): Promise<ScheduleExceptionEntity[]> {
    return this.exceptions
      .filter((e) => e.user_id === user_id)
      .map(ScheduleExceptionDataMapper.toDomain);
  }

  async list_by_user_and_date(user_id: string, date: Date): Promise<ScheduleExceptionEntity[]> {
    const target_date = this.normalize_date(date);
    return this.exceptions
      .filter((e) => {
        const exception_date = this.normalize_date(e.date);
        return e.user_id === user_id && exception_date.getTime() === target_date.getTime();
      })
      .map(ScheduleExceptionDataMapper.toDomain);
  }

  async list_by_user_and_date_range(
    user_id: string,
    start_date: Date,
    end_date: Date
  ): Promise<ScheduleExceptionEntity[]> {
    const start = this.normalize_date(start_date);
    const end = this.normalize_date(end_date);

    return this.exceptions
      .filter((e) => {
        const exception_date = this.normalize_date(e.date);
        return (
          e.user_id === user_id &&
          exception_date.getTime() >= start.getTime() &&
          exception_date.getTime() <= end.getTime()
        );
      })
      .map(ScheduleExceptionDataMapper.toDomain);
  }

  async update(exception: ScheduleExceptionEntity): Promise<ScheduleExceptionEntity> {
    const index = this.exceptions.findIndex((e) => e.id === exception.id);
    if (index === -1) {
      throw new Error(`ScheduleException with id ${exception.id} not found`);
    }

    const persistence = ScheduleExceptionDataMapper.toPersistence(exception);
    this.exceptions[index] = persistence;
    return ScheduleExceptionDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.exceptions.findIndex((e) => e.id === id);
    if (index === -1) return false;

    this.exceptions.splice(index, 1);
    return true;
  }

  private normalize_date(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }
}
