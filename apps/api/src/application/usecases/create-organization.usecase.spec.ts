import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreateOrganizationUseCase } from './create-organization.usecase';
import { InMemoryOrganizationRepository } from '@/infra/repositories/in-memory/in-memory-organization.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { OrganizationAlreadyExistsError } from '@/domain/errors/organization.errors';

describe('CreateOrganizationUseCase', () => {
  let sut: CreateOrganizationUseCase;
  let organization_repository: InMemoryOrganizationRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    organization_repository = new InMemoryOrganizationRepository();
    sut = new CreateOrganizationUseCase(organization_repository);
  });

  it('should create a new organization successfully', async () => {
    const input = {
      businessName: 'Beleza Salon',
      brandColor: '#FF5733',
      ownerId: 'usr_123',
    };

    const result = await sut.execute(input);

    expect(result.businessName).toBe('Beleza Salon');
    expect(result.brandColor).toBe('#FF5733');
    expect(result.ownerId).toBe('usr_123');
    expect(result.id).toContain('org_');
  });

  it('should create organization with subscription', async () => {
    const input = {
      businessName: 'Premium Salon',
      brandColor: '#00FF00',
      ownerId: 'usr_456',
      subscription: {
        plan: 'pro' as const,
        status: 'active' as const,
        expiresAt: new Date('2025-12-31'),
      },
    };

    const result = await sut.execute(input);

    expect(result.subscription?.plan).toBe('pro');
    expect(result.subscription?.status).toBe('active');
    expect(result.has_active_subscription()).toBe(true);
  });

  it('should throw error if organization already exists for owner', async () => {
    const input = {
      businessName: 'First Salon',
      brandColor: '#FF0000',
      ownerId: 'usr_789',
    };

    await sut.execute(input);

    await expect(sut.execute(input)).rejects.toThrow(OrganizationAlreadyExistsError);
  });

  it('should throw error if business name is too short', async () => {
    const input = {
      businessName: 'A',
      brandColor: '#FF0000',
      ownerId: 'usr_999',
    };

    await expect(sut.execute(input)).rejects.toThrow();
  });

  it('should throw error if brand color is invalid', async () => {
    const input = {
      businessName: 'Valid Name',
      brandColor: 'invalid-color',
      ownerId: 'usr_999',
    };

    await expect(sut.execute(input)).rejects.toThrow();
  });
});
