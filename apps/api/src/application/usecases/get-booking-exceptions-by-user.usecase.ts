import { BookingExceptionEntity } from '@/domain/entities/booking-exception.entity';
import { IBookingExceptionRepository } from '@/application/contracts/i-booking-exception-repository.interface';

class UseCase {
  constructor(private readonly booking_exception_repository: IBookingExceptionRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    if (input.date) {
      const exception = await this.booking_exception_repository.find_by_user_id_and_date(
        input.user_id,
        input.date,
      );
      return exception ? [exception] : [];
    }

    return this.booking_exception_repository.find_by_user_id(input.user_id);
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    date?: string;
  };

  export type Output = Promise<BookingExceptionEntity[]>;
}

export { UseCase as GetBookingExceptionsByUserUseCase };
