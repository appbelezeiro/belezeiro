import { Plan as PrismaPlan, RenewalInterval as PrismaRenewalInterval, Prisma } from '@prisma/client';
import { PlanEntity, RenewalInterval, PlanFeatures, PlanLimits } from '@/domain/entities/billing/plan.entity.js';

export class PlanDataMapper {
  static toDomain(raw: PrismaPlan): PlanEntity {
    return new PlanEntity({
      id: raw.id,
      name: raw.name,
      description: raw.description ?? undefined,
      price: raw.price,
      currency: raw.currency,
      interval: raw.interval as RenewalInterval,
      features: raw.features as PlanFeatures,
      limits: raw.limits as PlanLimits,
      trial_days: raw.trial_days ?? undefined,
      is_active: raw.is_active,
      metadata: raw.metadata as Record<string, any> | undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: PlanEntity): Prisma.PlanUncheckedUpdateInput {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      price: entity.price,
      currency: entity.currency,
      interval: entity.interval as PrismaRenewalInterval,
      features: entity.features as Prisma.InputJsonValue,
      limits: entity.limits as Prisma.InputJsonValue,
      trial_days: entity.trial_days ?? null,
      is_active: entity.is_active,
      metadata: entity.metadata ? (entity.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
    };
  }

  static toPrismaCreate(entity: PlanEntity): Prisma.PlanUncheckedCreateInput {
    return {
      ...PlanDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    } as Prisma.PlanUncheckedCreateInput;
  }
}
