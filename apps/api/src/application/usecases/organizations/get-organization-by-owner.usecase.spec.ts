import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GetOrganizationByOwnerUseCase } from './get-organization-by-owner.usecase';
import { InMemoryOrganizationRepository } from '@/infra/repositories/in-memory/organizations/in-memory-organization.repository';
import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('GetOrganizationByOwnerUseCase', () => {
  let sut: GetOrganizationByOwnerUseCase;
  let organization_repository: InMemoryOrganizationRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    organization_repository = new InMemoryOrganizationRepository();
    sut = new GetOrganizationByOwnerUseCase(organization_repository);
  });

  it('should return organization by owner id', async () => {
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
      ownerId: 'owner_123',
    };

    const result = await sut.execute(input);

    expect(result).not.toBeNull();
    expect(result?.ownerId).toBe('owner_123');
    expect(result?.businessName).toBe('Beauty Salon');
  });

  it('should return null when organization does not exist', async () => {
    const input = {
      ownerId: 'non_existent_owner',
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
      ownerId: 'owner_123',
    };

    const result = await sut.execute(input);

    expect(result?.businessName).toBe('Premium Spa');
    expect(result?.brandColor).toBe('#4ECDC4');
    expect(result?.subscription?.plan).toBe('enterprise');
    expect(result?.subscription?.status).toBe('active');
  });

  it('should return only one organization per owner', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      businessName: 'Salon 1',
      brandColor: '#FF6B6B',
      subscription: {
        plan: 'pro',
        status: 'active',
      },
    });

    await organization_repository.create(organization);

    const input = {
      ownerId: 'owner_123',
    };

    const result = await sut.execute(input);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(organization.id);
  });

  it('should not return organizations from other owners', async () => {
    const org1 = new OrganizationEntity({
      ownerId: 'owner_123',
      businessName: 'Salon 1',
      brandColor: '#FF6B6B',
      subscription: {
        plan: 'pro',
        status: 'active',
      },
    });

    const org2 = new OrganizationEntity({
      ownerId: 'owner_456',
      businessName: 'Salon 2',
      brandColor: '#4ECDC4',
      subscription: {
        plan: 'pro',
        status: 'active',
      },
    });

    await organization_repository.create(org1);
    await organization_repository.create(org2);

    const input = {
      ownerId: 'owner_123',
    };

    const result = await sut.execute(input);

    expect(result?.ownerId).toBe('owner_123');
    expect(result?.businessName).toBe('Salon 1');
  });
});
