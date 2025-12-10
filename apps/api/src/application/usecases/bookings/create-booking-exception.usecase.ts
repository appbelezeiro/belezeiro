import { BookingExceptionEntity } from '@/domain/entities/bookings/booking-exception.entity';
import { IBookingExceptionRepository } from '@/application/contracts/bookings/i-booking-exception-repository.interface';
import { InvalidTimeRangeError } from '@/domain/errors/bookings/invalid-time-range.error';

class UseCase {
  constructor(private readonly booking_exception_repository: IBookingExceptionRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // Validate override type has required fields
    if (input.type === 'override') {
      if (!input.start_time || !input.end_time || !input.slot_duration_minutes) {
        throw new InvalidTimeRangeError(
          'Override exceptions require start_time, end_time, and slot_duration_minutes',
        );
      }

      const start = new Date(input.start_time);
      const end = new Date(input.end_time);

      if (start >= end) {
        throw new InvalidTimeRangeError(
          `Start time (${input.start_time}) must be before end time (${input.end_time})`,
        );
      }
    }

    const exception = new BookingExceptionEntity({
      user_id: input.user_id,
      date: input.date,
      type: input.type,
      start_time: input.start_time,
      end_time: input.end_time,
      slot_duration_minutes: input.slot_duration_minutes,
      reason: input.reason,
    });

    return this.booking_exception_repository.create(exception);
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    date: string; // YYYY-MM-DD
    type: 'block' | 'override';
    start_time?: string;
    end_time?: string;
    slot_duration_minutes?: number;
    reason?: string;
  };

  export type Output = Promise<BookingExceptionEntity>;
}

export { UseCase as CreateBookingExceptionUseCase };
