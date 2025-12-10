import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { DiscountMapper } from '@/application/dtos/mappers/discount.mapper';
import {
  DiscountNotFoundError,
  DiscountExpiredError,
  DiscountMaxRedemptionsReachedError,
  DiscountNotValidForUserError,
  DiscountNotActiveError,
} from '@/domain/errors/discount.errors';
import { NotFoundError, BadRequestError } from '../errors/http-errors';

export class DiscountController {
  constructor(private readonly container: Container) {}

  async validate_code(c: Context) {
    try {
      const { code } = c.req.param();
      const user_id = c.req.query('user_id');

      if (!user_id) {
        throw new BadRequestError('user_id query parameter is required');
      }

      const result = await this.container.use_cases.validate_discount_code.execute({
        code,
        user_id,
      });

      return c.json({
        is_valid: result.is_valid,
        discount: result.is_valid ? DiscountMapper.toDTO(result.discount) : undefined,
      });
    } catch (error) {
      if (error instanceof DiscountNotFoundError) {
        throw new NotFoundError(error.message);
      }
      if (
        error instanceof DiscountExpiredError ||
        error instanceof DiscountMaxRedemptionsReachedError ||
        error instanceof DiscountNotValidForUserError ||
        error instanceof DiscountNotActiveError
      ) {
        return c.json(
          {
            is_valid: false,
            error: error.message,
          },
          200,
        );
      }
      throw error;
    }
  }
}
