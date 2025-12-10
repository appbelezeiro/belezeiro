import { IBookingRuleRepository } from '@/application/contracts/bookings/i-booking-rule-repository.interface';
import { IBookingExceptionRepository } from '@/application/contracts/bookings/i-booking-exception-repository.interface';
import { IBookingRepository } from '@/application/contracts/bookings/i-booking-repository.interface';
import { AvailabilityService } from '@/application/services/bookings/availability.service';
import { Slot } from '@/application/utils/date.utils';

class UseCase {
  private availability_service: AvailabilityService;

  constructor(
    booking_rule_repository: IBookingRuleRepository,
    booking_exception_repository: IBookingExceptionRepository,
    booking_repository: IBookingRepository,
  ) {
    this.availability_service = new AvailabilityService(
      booking_rule_repository,
      booking_exception_repository,
      booking_repository,
    );
  }

  async execute(input: UseCase.Input): UseCase.Output {
    const slots = await this.availability_service.get_available_slots(input.user_id, input.date);

    return {
      date: input.date,
      slots,
    };
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    date: string; // YYYY-MM-DD
  };

  export type Output = Promise<{
    date: string;
    slots: Slot[];
  }>;
}

export { UseCase as GetAvailableSlotsUseCase };
