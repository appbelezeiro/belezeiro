import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { ValidateDiscountCodeUseCase } from './validate-discount-code.usecase';
import { InMemoryDiscountRepository } from '@/infra/repositories/in-memory/billing/in-memory-discount.repository';
import { DiscountEntity } from '@/domain/entities/billing/discount.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { DiscountNotFoundError } from '@/domain/errors/billing/discount.errors';

describe('ValidateDiscountCodeUseCase', () => {
  let sut: ValidateDiscountCodeUseCase;
  let discount_repository: InMemoryDiscountRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    discount_repository = new InMemoryDiscountRepository();
    sut = new ValidateDiscountCodeUseCase(discount_repository);
  });

  it('should validate valid discount code', async () => {
    const discount = new DiscountEntity({
      code: 'SAVE20',
      type: 'percentage',
      value: 20,
      max_redemptions: 100,
      valid_from: new Date(Date.now() - 24 * 60 * 60 * 1000),
      valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await discount_repository.create(discount);

    const input = {
      code: 'SAVE20',
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result.discount.code).toBe('SAVE20');
    expect(result.is_valid).toBe(true);
  });

  it('should throw DiscountNotFoundError when code does not exist', async () => {
    const input = {
      code: 'INVALID_CODE',
      user_id: 'user_123',
    };

    await expect(sut.execute(input)).rejects.toThrow(DiscountNotFoundError);
  });

  it('should throw error when discount is expired', async () => {
    const discount = new DiscountEntity({
      code: 'EXPIRED',
      type: 'percentage',
      value: 20,
      max_redemptions: 100,
      valid_from: new Date(Date.now() - 48 * 60 * 60 * 1000),
      valid_until: new Date(Date.now() - 24 * 60 * 60 * 1000),
    });

    await discount_repository.create(discount);

    const input = {
      code: 'EXPIRED',
      user_id: 'user_123',
    };

    await expect(sut.execute(input)).rejects.toThrow();
  });

  it('should throw error when discount has no more redemptions', async () => {
    const discount = new DiscountEntity({
      code: 'MAXED',
      type: 'percentage',
      value: 20,
      max_redemptions: 1,
      valid_from: new Date(Date.now() - 24 * 60 * 60 * 1000),
      valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    discount.redeem();
    await discount_repository.create(discount);

    const input = {
      code: 'MAXED',
      user_id: 'user_123',
    };

    await expect(sut.execute(input)).rejects.toThrow();
  });

  it('should validate discount with unlimited redemptions', async () => {
    const discount = new DiscountEntity({
      code: 'UNLIMITED',
      type: 'fixed',
      value: 1000,
      valid_from: new Date(Date.now() - 24 * 60 * 60 * 1000),
      valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await discount_repository.create(discount);

    const input = {
      code: 'UNLIMITED',
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result.is_valid).toBe(true);
  });

  it('should validate discount with allowed user', async () => {
    const discount = new DiscountEntity({
      code: 'USER_SPECIFIC',
      type: 'percentage',
      value: 30,
      max_redemptions: 10,
      valid_from: new Date(Date.now() - 24 * 60 * 60 * 1000),
      valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000),
      allowed_user_ids: ['user_123', 'user_456'],
    });

    await discount_repository.create(discount);

    const input = {
      code: 'USER_SPECIFIC',
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result.is_valid).toBe(true);
  });

  it('should throw error when user is not in allowed list', async () => {
    const discount = new DiscountEntity({
      code: 'RESTRICTED',
      type: 'percentage',
      value: 30,
      max_redemptions: 10,
      valid_from: new Date(Date.now() - 24 * 60 * 60 * 1000),
      valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000),
      allowed_user_ids: ['user_456', 'user_789'],
    });

    await discount_repository.create(discount);

    const input = {
      code: 'RESTRICTED',
      user_id: 'user_123',
    };

    await expect(sut.execute(input)).rejects.toThrow();
  });

  it('should return discount with all properties', async () => {
    const discount = new DiscountEntity({
      code: 'COMPLETE',
      type: 'percentage',
      value: 25,
      max_redemptions: 50,
      valid_from: new Date(Date.now() - 24 * 60 * 60 * 1000),
      valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000),
      allowed_plan_ids: ['plan_123', 'plan_456'],
      metadata: {
        campaign: 'black_friday',
      },
    });

    await discount_repository.create(discount);

    const input = {
      code: 'COMPLETE',
      user_id: 'user_123',
    };

    const result = await sut.execute(input);

    expect(result.discount.code).toBe('COMPLETE');
    expect(result.discount.type).toBe('percentage');
    expect(result.discount.value).toBe(25);
    expect(result.is_valid).toBe(true);
  });
});
