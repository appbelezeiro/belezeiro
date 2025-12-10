import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { UpdateOrganizationUseCase } from './update-organization.usecase';
import { InMemoryOrganizationRepository } from '@/infra/repositories/in-memory/organizations/in-memory-organization.repository';
import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { OrganizationNotFoundError } from '@/domain/errors/organizations/organization.errors';

describe('UpdateOrganizationUseCase', () => {
  let sut: UpdateOrganizationUseCase;
  let organization_repository: InMemoryOrganizationRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    organization_repository = new InMemoryOrganizationRepository();
    sut = new UpdateOrganizationUseCase(organization_repository);
  });

  it('should update organization business name', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      businessName: 'Old Name',
      brandColor: '#FF6B6B',
      subscription: {
        plan: 'pro',
        status: 'active',
      },
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
      businessName: 'New Name',
    };

    const result = await sut.execute(input);

    expect(result.businessName).toBe('New Name');
  });

  it('should update organization brand color', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      businessName: 'Beauty Salon',
      brandColor: '#FF6B6B',
      subscription: {
        plan: 'pro',
        status: 'active',
      },
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
      brandColor: '#4ECDC4',
    };

    const result = await sut.execute(input);

    expect(result.brandColor).toBe('#4ECDC4');
  });

  it('should update organization subscription', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      businessName: 'Beauty Salon',
      brandColor: '#FF6B6B',
      subscription: {
        plan: 'free',
        status: 'active',
      },
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
      subscription: {
        plan: 'pro' as const,
        status: 'active' as const,
        expiresAt: new Date('2025-12-31'),
      },
    };

    const result = await sut.execute(input);

    expect(result.subscription.plan).toBe('pro');
    expect(result.subscription.expiresAt).toBeInstanceOf(Date);
  });

  it('should throw OrganizationNotFoundError when organization does not exist', async () => {
    const input = {
      id: 'non_existent_id',
      businessName: 'New Name',
    };

    await expect(sut.execute(input)).rejects.toThrow(OrganizationNotFoundError);
  });

  it('should update multiple properties at once', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      businessName: 'Old Name',
      brandColor: '#FF6B6B',
      subscription: {
        plan: 'free',
        status: 'inactive',
      },
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
      businessName: 'New Name',
      brandColor: '#4ECDC4',
      subscription: {
        plan: 'enterprise' as const,
        status: 'active' as const,
        expiresAt: new Date('2026-01-01'),
      },
    };

    const result = await sut.execute(input);

    expect(result.businessName).toBe('New Name');
    expect(result.brandColor).toBe('#4ECDC4');
    expect(result.subscription.plan).toBe('enterprise');
    expect(result.subscription.status).toBe('active');
  });

  it('should update only business name without changing other properties', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      businessName: 'Old Name',
      brandColor: '#FF6B6B',
      subscription: {
        plan: 'pro',
        status: 'active',
      },
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
      businessName: 'New Name',
    };

    const result = await sut.execute(input);

    expect(result.businessName).toBe('New Name');
    expect(result.brandColor).toBe('#FF6B6B');
    expect(result.subscription.plan).toBe('pro');
  });

  it('should handle subscription status changes', async () => {
    const statuses = ['active', 'inactive', 'suspended'] as const;

    for (const status of statuses) {
      const organization = new OrganizationEntity({
        ownerId: 'owner_123',
        businessName: 'Salon',
        brandColor: '#FF6B6B',
        subscription: {
          plan: 'pro',
          status: 'active',
        },
      });

      await organization_repository.create(organization);

      const input = {
        id: organization.id,
        subscription: {
          plan: 'pro' as const,
          status,
        },
      };

      const result = await sut.execute(input);

      expect(result.subscription.status).toBe(status);
    }
  });

  it('should handle subscription plan upgrades', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      businessName: 'Salon',
      brandColor: '#FF6B6B',
      subscription: {
        plan: 'free',
        status: 'active',
      },
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
      subscription: {
        plan: 'enterprise' as const,
        status: 'active' as const,
        expiresAt: new Date('2025-12-31'),
      },
    };

    const result = await sut.execute(input);

    expect(result.subscription.plan).toBe('enterprise');
  });

  it('should update updated_at timestamp', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      businessName: 'Old Name',
      brandColor: '#FF6B6B',
      subscription: {
        plan: 'pro',
        status: 'active',
      },
    });

    await organization_repository.create(organization);

    const old_updated_at = organization.updated_at;

    // Wait a bit to ensure timestamp changes
    await new Promise((resolve) => setTimeout(resolve, 10));

    const input = {
      id: organization.id,
      businessName: 'New Name',
    };

    const result = await sut.execute(input);

    expect(result.updated_at.getTime()).toBeGreaterThan(old_updated_at.getTime());
  });
});
