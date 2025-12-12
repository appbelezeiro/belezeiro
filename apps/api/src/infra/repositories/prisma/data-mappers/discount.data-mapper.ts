import { Discount as PrismaDiscount, DiscountType as PrismaDiscountType, DiscountDuration as PrismaDiscountDuration } from '@prisma/client';
import { DiscountEntity, DiscountType, DiscountDuration } from '@/domain/entities/billing/discount.entity.js';

const typeToPrisma: Record<DiscountType, PrismaDiscountType> = {
  [DiscountType.PERCENTAGE]: 'percentage',
  [DiscountType.FIXED]: 'fixed',
  [DiscountType.FREE_PERIOD]: 'free_period',
};

const typeFromPrisma: Record<PrismaDiscountType, DiscountType> = {
  percentage: DiscountType.PERCENTAGE,
  fixed: DiscountType.FIXED,
  free_period: DiscountType.FREE_PERIOD,
};

const durationToPrisma: Record<DiscountDuration, PrismaDiscountDuration> = {
  [DiscountDuration.ONCE]: 'once',
  [DiscountDuration.REPEATING]: 'repeating',
  [DiscountDuration.FOREVER]: 'forever',
};

const durationFromPrisma: Record<PrismaDiscountDuration, DiscountDuration> = {
  once: DiscountDuration.ONCE,
  repeating: DiscountDuration.REPEATING,
  forever: DiscountDuration.FOREVER,
};

export class DiscountDataMapper {
  static toDomain(raw: PrismaDiscount): DiscountEntity {
    return new DiscountEntity({
      id: raw.id,
      code: raw.code,
      type: typeFromPrisma[raw.type],
      value: raw.value,
      duration: durationFromPrisma[raw.duration],
      repeating_count: raw.repeating_count ?? undefined,
      assigned_to_user_id: raw.assigned_to_user_id ?? undefined,
      max_redemptions: raw.max_redemptions ?? undefined,
      redemptions_count: raw.redemptions_count,
      expires_at: raw.expires_at ?? undefined,
      is_active: raw.is_active,
      metadata: raw.metadata as Record<string, any> | undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: DiscountEntity): Omit<PrismaDiscount, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      code: entity.code,
      type: typeToPrisma[entity.type],
      value: entity.value,
      duration: durationToPrisma[entity.duration],
      repeating_count: entity.repeating_count ?? null,
      assigned_to_user_id: entity.assigned_to_user_id ?? null,
      max_redemptions: entity.max_redemptions ?? null,
      redemptions_count: entity.redemptions_count,
      expires_at: entity.expires_at ?? null,
      is_active: entity.is_active,
      metadata: entity.metadata ?? null,
    };
  }

  static toPrismaCreate(entity: DiscountEntity): Omit<PrismaDiscount, 'updated_at'> {
    return {
      ...DiscountDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    };
  }
}
