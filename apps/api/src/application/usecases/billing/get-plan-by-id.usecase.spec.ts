import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GetPlanByIdUseCase } from './get-plan-by-id.usecase';
import { InMemoryPlanRepository } from '@/infra/repositories/in-memory/billing/in-memory-plan.repository';
import { PlanEntity, RenewalInterval } from '@/domain/entities/billing/plan.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { PlanNotFoundError } from '@/domain/errors/billing/plan.errors';

describe('GetPlanByIdUseCase', () => {
  let sut: GetPlanByIdUseCase;
  let plan_repository: InMemoryPlanRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    plan_repository = new InMemoryPlanRepository();
    sut = new GetPlanByIdUseCase(plan_repository);
  });

  it('should return a plan by id', async () => {
    const plan = new PlanEntity({
      name: 'Basic Plan',
      description: 'Basic plan description',
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

    await plan_repository.create(plan);

    const result = await sut.execute({ plan_id: plan.id });

    expect(result).toBeDefined();
    expect(result.id).toBe(plan.id);
    expect(result.name).toBe('Basic Plan');
    expect(result.price).toBe(2999);
  });

  it('should throw PlanNotFoundError when plan does not exist', async () => {
    await expect(
      sut.execute({ plan_id: 'plan_nonexistent' })
    ).rejects.toThrow(PlanNotFoundError);
  });
});
