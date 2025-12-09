import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreateScheduleExceptionUseCase } from './create-schedule-exception.usecase';
import { InMemoryScheduleExceptionRepository } from '@/infra/repositories/in-memory/in-memory-schedule-exception.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('CreateScheduleExceptionUseCase', () => {
  let sut: CreateScheduleExceptionUseCase;
  let schedule_exception_repository: InMemoryScheduleExceptionRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    schedule_exception_repository = new InMemoryScheduleExceptionRepository();
    sut = new CreateScheduleExceptionUseCase(schedule_exception_repository);
  });

  it('should create a new schedule exception (block)', async () => {
    const input = {
      user_id: 'user-1',
      date: new Date('2024-06-15'),
      type: 'block' as const,
      reason: 'Holiday',
    };

    const exception = await sut.execute(input);

    expect(exception.user_id).toBe('user-1');
    expect(exception.type).toBe('block');
    expect(exception.reason).toBe('Holiday');
    expect(exception.id).toContain('sex_');
  });

  it('should create a new schedule exception (custom)', async () => {
    const input = {
      user_id: 'user-1',
      date: new Date('2024-06-15'),
      type: 'custom' as const,
      start_time: '14:00',
      end_time: '15:00',
      reason: 'Meeting',
    };

    const exception = await sut.execute(input);

    expect(exception.user_id).toBe('user-1');
    expect(exception.type).toBe('custom');
    expect(exception.start_time).toBe('14:00');
    expect(exception.end_time).toBe('15:00');
    expect(exception.reason).toBe('Meeting');
    expect(exception.id).toContain('sex_');
  });
});
