import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { ListActivePlansUseCase } from './list-active-plans.usecase';
import { InMemoryPlanRepository } from '@/infra/repositories/in-memory/billing/in-memory-plan.repository';
import { PlanEntity, RenewalInterval } from '@/domain/entities/billing/plan.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('ListActivePlansUseCase', () => {
  let sut: ListActivePlansUseCase;
  let plan_repository: InMemoryPlanRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    plan_repository = new InMemoryPlanRepository();
    sut = new ListActivePlansUseCase(plan_repository);
  });

  it('should return all active plans', async () => {
    const plan1 = new PlanEntity({
      name: 'Basic Plan',
      price: 2999,
      currency: 'BRL',
      interval: RenewalInterval.MONTHLY,
      features: {
        advanced_booking: false,
        custom_branding: false,
        analytics: false,
        api_access: false,
        priority_support: false,
        custom_integrations: false,
      },
      limits: {
        max_bookings_per_month: 100,
        max_concurrent_bookings: 10,
        max_booking_rules: 5,
        max_team_members: 2,
        max_locations: 1,
      },
    });

    await plan_repository.create(plan1);

    const result = await sut.execute({});

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Basic Plan');
  });

  it('should return empty array when no active plans exist', async () => {
    const result = await sut.execute({});

    expect(result).toHaveLength(0);
  });
});
