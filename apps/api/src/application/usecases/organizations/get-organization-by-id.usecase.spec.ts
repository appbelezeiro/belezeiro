import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GetOrganizationByIdUseCase } from './get-organization-by-id.usecase';
import { InMemoryOrganizationRepository } from '@/infra/repositories/in-memory/organizations/in-memory-organization.repository';
import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('GetOrganizationByIdUseCase', () => {
  let sut: GetOrganizationByIdUseCase;
  let organization_repository: InMemoryOrganizationRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    organization_repository = new InMemoryOrganizationRepository();
    sut = new GetOrganizationByIdUseCase(organization_repository);
  });

  it('should return organization by id', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      businessName: 'Beauty Salon',
      brandColor: '#FF6B6B',
      subscription: {
        plan: 'pro',
        status: 'active',
        expiresAt: new Date('2025-12-31'),
      },
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
    };

    const result = await sut.execute(input);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(organization.id);
    expect(result?.businessName).toBe('Beauty Salon');
  });

  it('should return null when organization does not exist', async () => {
    const input = {
      id: 'non_existent_id',
    };

    const result = await sut.execute(input);

    expect(result).toBeNull();
  });

  it('should return organization with all properties', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      businessName: 'Premium Spa',
      brandColor: '#4ECDC4',
      subscription: {
        plan: 'enterprise',
        status: 'active',
        expiresAt: new Date('2025-12-31'),
      },
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
    };

    const result = await sut.execute(input);

    expect(result?.ownerId).toBe('owner_123');
    expect(result?.businessName).toBe('Premium Spa');
    expect(result?.brandColor).toBe('#4ECDC4');
    expect(result?.subscription?.plan).toBe('enterprise');
    expect(result?.subscription?.status).toBe('active');
    expect(result?.subscription?.expiresAt).toBeInstanceOf(Date);
  });

  it('should return organization with suspended subscription', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      businessName: 'Suspended Salon',
      brandColor: '#FF6B6B',
      subscription: {
        plan: 'pro',
        status: 'suspended',
      },
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
    };

    const result = await sut.execute(input);

    expect(result?.subscription?.status).toBe('suspended');
  });

  it('should return organization with inactive subscription', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      businessName: 'Inactive Salon',
      brandColor: '#FF6B6B',
      subscription: {
        plan: 'free',
        status: 'inactive',
      },
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
    };

    const result = await sut.execute(input);

    expect(result?.subscription?.status).toBe('inactive');
  });

  it('should return organization with different plans', async () => {
    const plans = ['free', 'pro', 'enterprise'] as const;

    for (const plan of plans) {
      const organization = new OrganizationEntity({
        ownerId: `owner_${plan}`,
        businessName: `Salon ${plan}`,
        brandColor: '#FF6B6B',
        subscription: {
          plan,
          status: 'active',
        },
      });

      await organization_repository.create(organization);

      const input = {
        id: organization.id,
      };

      const result = await sut.execute(input);

      expect(result?.subscription?.plan).toBe(plan);
    }
  });
});
