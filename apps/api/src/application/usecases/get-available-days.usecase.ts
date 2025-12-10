import { IBookingRuleRepository } from '@/application/contracts/i-booking-rule-repository.interface';
import { IBookingExceptionRepository } from '@/application/contracts/i-booking-exception-repository.interface';
import { IBookingRepository } from '@/application/contracts/i-booking-repository.interface';
import { AvailabilityService } from '@/application/services/availability.service';

class UseCase {
  private availability_service: AvailabilityService;

  constructor(
    private readonly booking_rule_repository: IBookingRuleRepository,
    private readonly booking_exception_repository: IBookingExceptionRepository,
    private readonly booking_repository: IBookingRepository,
  ) {
    this.availability_service = new AvailabilityService(
      booking_rule_repository,
      booking_exception_repository,
      booking_repository,
    );
  }

  async execute(input: UseCase.Input): UseCase.Output {
    const days_ahead = input.days_ahead ?? 45;
    const days = await this.availability_service.get_available_days(input.user_id, days_ahead);

    return { days };
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    days_ahead?: number;
  };

  export type Output = Promise<{ days: string[] }>;
}

export { UseCase as GetAvailableDaysUseCase };
