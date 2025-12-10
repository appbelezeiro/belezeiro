import { BookingEntity } from '@/domain/entities/booking.entity';
import { IBookingRepository } from '@/application/contracts/i-booking-repository.interface';
import { BookingNotFoundError } from '@/domain/errors/booking-not-found.error';

class UseCase {
  constructor(private readonly booking_repository: IBookingRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const booking = await this.booking_repository.find_by_id(input.id);

    if (!booking) {
      throw new BookingNotFoundError(`Booking with id ${input.id} not found`);
    }

    booking.cancel();

    return this.booking_repository.update(booking);
  }
}

declare namespace UseCase {
  export type Input = {
    id: string;
  };

  export type Output = Promise<BookingEntity>;
}

export { UseCase as CancelBookingUseCase };
