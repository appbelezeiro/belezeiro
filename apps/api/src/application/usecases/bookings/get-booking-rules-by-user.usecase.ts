import { BookingRuleEntity } from '@/domain/entities/bookings/booking-rule.entity';
import { IBookingRuleRepository } from '@/application/contracts/bookings/i-booking-rule-repository.interface';

class UseCase {
  constructor(private readonly booking_rule_repository: IBookingRuleRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.booking_rule_repository.find_by_user_id(input.user_id);
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
  };

  export type Output = Promise<BookingRuleEntity[]>;
}

export { UseCase as GetBookingRulesByUserUseCase };
