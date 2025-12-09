import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GetScheduleExceptionsByUserUseCase } from './get-schedule-exceptions-by-user.usecase';
import { InMemoryScheduleExceptionRepository } from '@/infra/repositories/in-memory/in-memory-schedule-exception.repository';
import { ScheduleExceptionEntity } from '@/domain/entities/schedule-exception.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('GetScheduleExceptionsByUserUseCase', () => {
  let sut: GetScheduleExceptionsByUserUseCase;
  let schedule_exception_repository: InMemoryScheduleExceptionRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    schedule_exception_repository = new InMemoryScheduleExceptionRepository();
    sut = new GetScheduleExceptionsByUserUseCase(schedule_exception_repository);
  });

  it('should get all schedule exceptions by user', async () => {
    const exception = new ScheduleExceptionEntity({
      user_id: 'user-1',
      date: new Date('2024-06-15'),
      type: 'block',
    });
    await schedule_exception_repository.create(exception);

    const input = {
      user_id: 'user-1',
    };

    const exceptions = await sut.execute(input);

    expect(exceptions).toHaveLength(1);
    expect(exceptions[0].user_id).toBe('user-1');
  });

  it('should get schedule exceptions by user and specific date', async () => {
    const exception1 = new ScheduleExceptionEntity({
      user_id: 'user-1',
      date: new Date('2024-06-15'),
      type: 'block',
    });
    const exception2 = new ScheduleExceptionEntity({
      user_id: 'user-1',
      date: new Date('2024-06-16'),
      type: 'block',
    });

    await schedule_exception_repository.create(exception1);
    await schedule_exception_repository.create(exception2);

    const input = {
      user_id: 'user-1',
      date: new Date('2024-06-15'),
    };

    const exceptions = await sut.execute(input);

    expect(exceptions).toHaveLength(1);
  });

  it('should get schedule exceptions by user and date range', async () => {
    const exception1 = new ScheduleExceptionEntity({
      user_id: 'user-1',
      date: new Date('2024-06-05'),
      type: 'block',
    });
    const exception2 = new ScheduleExceptionEntity({
      user_id: 'user-1',
      date: new Date('2024-06-15'),
      type: 'block',
    });
    const exception3 = new ScheduleExceptionEntity({
      user_id: 'user-1',
      date: new Date('2024-06-25'),
      type: 'block',
    });

    await schedule_exception_repository.create(exception1);
    await schedule_exception_repository.create(exception2);
    await schedule_exception_repository.create(exception3);

    const input = {
      user_id: 'user-1',
      start_date: new Date('2024-06-01'),
      end_date: new Date('2024-06-20'),
    };

    const exceptions = await sut.execute(input);

    expect(exceptions).toHaveLength(2);
  });
});
