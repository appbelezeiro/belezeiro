import { IBookingExceptionRepository } from '@/application/contracts/i-booking-exception-repository.interface';
import { ExceptionNotFoundError } from '@/domain/errors/exception-not-found.error';

class UseCase {
  constructor(private readonly booking_exception_repository: IBookingExceptionRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const deleted = await this.booking_exception_repository.delete(input.id);

    if (!deleted) {
      throw new ExceptionNotFoundError(`Booking exception with id ${input.id} not found`);
    }

    return { success: true };
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
  };

  export type Output = Promise<{ success: boolean }>;
}

export { UseCase as DeleteBookingExceptionUseCase };
