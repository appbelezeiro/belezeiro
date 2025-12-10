import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { DeleteBookingExceptionUseCase } from './delete-booking-exception.usecase';
import { InMemoryBookingExceptionRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking-exception.repository';
import { BookingExceptionEntity } from '@/domain/entities/bookings/booking-exception.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { ExceptionNotFoundError } from '@/domain/errors/bookings/exception-not-found.error';

describe('DeleteBookingExceptionUseCase', () => {
  let sut: DeleteBookingExceptionUseCase;
  let booking_exception_repository: InMemoryBookingExceptionRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    booking_exception_repository = new InMemoryBookingExceptionRepository();
    sut = new DeleteBookingExceptionUseCase(booking_exception_repository);
  });

  it('should delete booking exception', async () => {
    const exception = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-25',
      type: 'block',
      reason: 'Holiday',
    });

    await booking_exception_repository.create(exception);

    const input = {
      id: exception.id,
    };

    const result = await sut.execute(input);

    expect(result.success).toBe(true);
  });

  it('should throw ExceptionNotFoundError when exception does not exist', async () => {
    const input = {
      id: 'non_existent_id',
    };

    await expect(sut.execute(input)).rejects.toThrow(ExceptionNotFoundError);
  });

  it('should remove exception from repository', async () => {
    const exception = new BookingExceptionEntity({
      user_id: 'user_123',
      date: '2024-12-25',
      type: 'block',
      reason: 'Holiday',
    });

    await booking_exception_repository.create(exception);

    const input = {
      id: exception.id,
    };

    await sut.execute(input);

    const found = await booking_exception_repository.find_by_id(exception.id);
    expect(found).toBeNull();
  });
});
