import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CancelBookingUseCase } from './cancel-booking.usecase';
import { InMemoryBookingRepository } from '@/infra/repositories/in-memory/bookings/in-memory-booking.repository';
import { BookingEntity } from '@/domain/entities/bookings/booking.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { BookingNotFoundError } from '@/domain/errors/bookings/booking-not-found.error';

describe('CancelBookingUseCase', () => {
  let sut: CancelBookingUseCase;
  let booking_repository: InMemoryBookingRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    booking_repository = new InMemoryBookingRepository();
    sut = new CancelBookingUseCase(booking_repository);
  });

  it('should cancel booking', async () => {
    const booking = new BookingEntity({
      professional_id: 'prof_123',
      client_id: 'client_123',
      unit_id: 'unit_123',
      service_id: 'service_123',
      start_time: new Date('2024-12-15T10:00:00Z'),
      end_time: new Date('2024-12-15T11:00:00Z'),
      status: 'confirmed',
    });

    await booking_repository.create(booking);

    const input = {
      id: booking.id,
    };

    const result = await sut.execute(input);

    expect(result.status).toBe('cancelled');
    expect(result.id).toBe(booking.id);
  });

  it('should throw BookingNotFoundError when booking does not exist', async () => {
    const input = {
      id: 'non_existent_id',
    };

    await expect(sut.execute(input)).rejects.toThrow(BookingNotFoundError);
  });

  it('should update booking in repository', async () => {
    const booking = new BookingEntity({
      professional_id: 'prof_123',
      client_id: 'client_123',
      unit_id: 'unit_123',
      service_id: 'service_123',
      start_time: new Date('2024-12-15T10:00:00Z'),
      end_time: new Date('2024-12-15T11:00:00Z'),
      status: 'confirmed',
    });

    await booking_repository.create(booking);

    const input = {
      id: booking.id,
    };

    await sut.execute(input);

    const updated = await booking_repository.find_by_id(booking.id);
    expect(updated?.status).toBe('cancelled');
  });

  it('should handle already cancelled booking', async () => {
    const booking = new BookingEntity({
      professional_id: 'prof_123',
      client_id: 'client_123',
      unit_id: 'unit_123',
      service_id: 'service_123',
      start_time: new Date('2024-12-15T10:00:00Z'),
      end_time: new Date('2024-12-15T11:00:00Z'),
      status: 'cancelled',
    });

    await booking_repository.create(booking);

    const input = {
      id: booking.id,
    };

    const result = await sut.execute(input);

    expect(result.status).toBe('cancelled');
  });
});
