import { ISubscriptionRepository } from '@/application/contracts/billing/i-subscription-repository.interface.js';
import { SubscriptionEntity, SubscriptionStatus } from '@/domain/entities/billing/subscription.entity.js';
import { prisma } from '@/infra/clients/prisma-client.js';
import { SubscriptionDataMapper } from '../data-mappers/index.js';
import { SubscriptionStatus as PrismaSubscriptionStatus } from '@prisma/client';

const statusToPrisma: Record<SubscriptionStatus, PrismaSubscriptionStatus> = {
  [SubscriptionStatus.INCOMPLETE]: 'incomplete',
  [SubscriptionStatus.INCOMPLETE_EXPIRED]: 'incomplete_expired',
  [SubscriptionStatus.TRIALING]: 'trialing',
  [SubscriptionStatus.ACTIVE]: 'active',
  [SubscriptionStatus.PAST_DUE]: 'past_due',
  [SubscriptionStatus.UNPAID]: 'unpaid',
  [SubscriptionStatus.CANCELED]: 'canceled',
  [SubscriptionStatus.EXPIRED]: 'expired',
};

export class PrismaSubscriptionRepository implements ISubscriptionRepository {
  async create(entity: SubscriptionEntity): Promise<SubscriptionEntity> {
    const data = SubscriptionDataMapper.toPrismaCreate(entity);
    const created = await prisma.subscription.create({ data });
    return SubscriptionDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<SubscriptionEntity | null> {
    const found = await prisma.subscription.findUnique({ where: { id } });
    return found ? SubscriptionDataMapper.toDomain(found) : null;
  }

  async find_by_unit_id(unit_id: string): Promise<SubscriptionEntity | null> {
    const found = await prisma.subscription.findUnique({ where: { unit_id } });
    return found ? SubscriptionDataMapper.toDomain(found) : null;
  }

  async find_by_user_id(user_id: string): Promise<SubscriptionEntity[]> {
    const subscriptions = await prisma.subscription.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
    });
    return subscriptions.map(SubscriptionDataMapper.toDomain);
  }

  async find_by_provider_id(provider_id: string): Promise<SubscriptionEntity | null> {
    const found = await prisma.subscription.findFirst({
      where: { provider_subscription_id: provider_id },
    });
    return found ? SubscriptionDataMapper.toDomain(found) : null;
  }

  async update(entity: SubscriptionEntity): Promise<SubscriptionEntity> {
    const data = SubscriptionDataMapper.toPrisma(entity);
    const updated = await prisma.subscription.update({
      where: { id: entity.id },
      data,
    });
    return SubscriptionDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.subscription.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async find_expiring_trials(days: number): Promise<SubscriptionEntity[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'trialing',
        trial_end: {
          gte: now,
          lte: futureDate,
        },
      },
      orderBy: { trial_end: 'asc' },
    });
    return subscriptions.map(SubscriptionDataMapper.toDomain);
  }

  async find_by_status(status: SubscriptionStatus): Promise<SubscriptionEntity[]> {
    const subscriptions = await prisma.subscription.findMany({
      where: { status: statusToPrisma[status] },
      orderBy: { created_at: 'desc' },
    });
    return subscriptions.map(SubscriptionDataMapper.toDomain);
  }

  async list_all(): Promise<SubscriptionEntity[]> {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: { created_at: 'desc' },
    });
    return subscriptions.map(SubscriptionDataMapper.toDomain);
  }
}
