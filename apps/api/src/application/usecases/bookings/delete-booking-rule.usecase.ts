import { IBookingRuleRepository } from '@/application/contracts/bookings/i-booking-rule-repository.interface';
import { RuleNotFoundError } from '@/domain/errors/bookings/rule-not-found.error';

class UseCase {
  constructor(private readonly booking_rule_repository: IBookingRuleRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const deleted = await this.booking_rule_repository.delete(input.id);

    if (!deleted) {
      throw new RuleNotFoundError(`Booking rule with id ${input.id} not found`);
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

export { UseCase as DeleteBookingRuleUseCase };
