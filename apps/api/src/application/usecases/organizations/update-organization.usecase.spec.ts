import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { UpdateOrganizationUseCase } from './update-organization.usecase';
import { InMemoryOrganizationRepository } from '@/infra/repositories/in-memory/organizations/in-memory-organization.repository';
import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { OrganizationNotFoundError, InvalidBusinessNameError } from '@/domain/errors/organizations/organization.errors';

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
      name: 'Old Name',
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
      name: 'New Name',
    };

    const result = await sut.execute(input);

    expect(result.name).toBe('New Name');
  });

  it('should throw OrganizationNotFoundError when organization does not exist', async () => {
    const input = {
      id: 'non_existent_id',
      name: 'New Name',
    };

    await expect(sut.execute(input)).rejects.toThrow(OrganizationNotFoundError);
  });

  it('should not change name when not provided in input', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      name: 'Original Name',
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
    };

    const result = await sut.execute(input);

    expect(result.name).toBe('Original Name');
  });

  it('should update updated_at timestamp', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      name: 'Old Name',
    });

    await organization_repository.create(organization);

    const old_updated_at = organization.updated_at;

    // Wait a bit to ensure timestamp changes
    await new Promise((resolve) => setTimeout(resolve, 10));

    const input = {
      id: organization.id,
      name: 'New Name',
    };

    const result = await sut.execute(input);

    expect(result.updated_at.getTime()).toBeGreaterThan(old_updated_at.getTime());
  });

  it('should throw error if new name is too short', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      name: 'Valid Name',
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
      name: 'A',
    };

    await expect(sut.execute(input)).rejects.toThrow(InvalidBusinessNameError);
  });

  it('should preserve owner_id when updating name', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      name: 'Old Name',
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
      name: 'New Name',
    };

    const result = await sut.execute(input);

    expect(result.ownerId).toBe('owner_123');
  });
});
