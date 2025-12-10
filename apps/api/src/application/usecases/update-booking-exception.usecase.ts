import { BookingExceptionEntity } from '@/domain/entities/booking-exception.entity';
import { IBookingExceptionRepository } from '@/application/contracts/i-booking-exception-repository.interface';
import { ExceptionNotFoundError } from '@/domain/errors/exception-not-found.error';
import { InvalidTimeRangeError } from '@/domain/errors/invalid-time-range.error';

class UseCase {
  constructor(private readonly booking_exception_repository: IBookingExceptionRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const exception = await this.booking_exception_repository.find_by_id(input.id);

    if (!exception) {
      throw new ExceptionNotFoundError(`Booking exception with id ${input.id} not found`);
    }

    // Update override times if provided
    if (
      input.start_time !== undefined &&
      input.end_time !== undefined &&
      input.slot_duration_minutes !== undefined
    ) {
      const start = new Date(input.start_time);
      const end = new Date(input.end_time);

      if (start >= end) {
        throw new InvalidTimeRangeError(
          `Start time (${input.start_time}) must be before end time (${input.end_time})`,
        );
      }

      exception.update_override_times(input.start_time, input.end_time, input.slot_duration_minutes);
    }

    // Update reason if provided
    if (input.reason !== undefined) {
      exception.update_reason(input.reason);
    }

    return this.booking_exception_repository.update(exception);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
    start_time?: string;
    end_time?: string;
    slot_duration_minutes?: number;
    reason?: string;
  };

  export type Output = Promise<BookingExceptionEntity>;
}

export { UseCase as UpdateBookingExceptionUseCase };
