import { DiscountEntity } from '@/domain/entities/discount.entity';
import { IDiscountRepository } from '@/application/contracts/i-discount-repository.interface';
import { DiscountNotFoundError } from '@/domain/errors/discount.errors';

class UseCase {
  constructor(private readonly discount_repository: IDiscountRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Find discount by code
    const discount = await this.discount_repository.find_by_code(input.code);

    if (!discount) {
      throw new DiscountNotFoundError(`Discount code '${input.code}' not found`);
    }

    // 2. Validate discount for user (throws if invalid)
    discount.validate_for_user(input.user_id);

    // 3. Return valid discount
    return {
      discount,
      is_valid: true,
    };
  }
}

declare namespace UseCase {
  export type Input = {
    code: string;
    user_id: string;
  };

  export type Output = Promise<{
    discount: DiscountEntity;
    is_valid: boolean;
  }>;
}

export { UseCase as ValidateDiscountCodeUseCase };
