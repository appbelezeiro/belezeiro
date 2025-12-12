import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { ListOrganizationsByOwnerUseCase } from './list-organizations-by-owner.usecase';
import { InMemoryOrganizationRepository } from '@/infra/repositories/in-memory/organizations/in-memory-organization.repository';
import { OrganizationEntity } from '@/domain/entities/organizations/organization.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('ListOrganizationsByOwnerUseCase', () => {
  let sut: ListOrganizationsByOwnerUseCase;
  let organization_repository: InMemoryOrganizationRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    organization_repository = new InMemoryOrganizationRepository();
    sut = new ListOrganizationsByOwnerUseCase(organization_repository);
  });

  it('should return organizations by owner id', async () => {
    const organization = new OrganizationEntity({
      ownerId: 'owner_123',
      name: 'Beauty Salon',
    });

    await organization_repository.create(organization);

    const input = {
      ownerId: 'owner_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(1);
    expect(result[0].ownerId).toBe('owner_123');
    expect(result[0].name).toBe('Beauty Salon');
  });

  it('should return empty array when no organizations exist for owner', async () => {
    const input = {
      ownerId: 'non_existent_owner',
    };

    const result = await sut.execute(input);

    expect(result).toEqual([]);
  });

  it('should return multiple organizations for same owner', async () => {
    const org1 = new OrganizationEntity({
      ownerId: 'owner_123',
      name: 'Salon 1',
    });

    const org2 = new OrganizationEntity({
      ownerId: 'owner_123',
      name: 'Salon 2',
    });

    await organization_repository.create(org1);
    await organization_repository.create(org2);

    const input = {
      ownerId: 'owner_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(2);
    expect(result.map((o) => o.name)).toContain('Salon 1');
    expect(result.map((o) => o.name)).toContain('Salon 2');
  });

  it('should not return organizations from other owners', async () => {
    const org1 = new OrganizationEntity({
      ownerId: 'owner_123',
      name: 'Salon 1',
    });

    const org2 = new OrganizationEntity({
      ownerId: 'owner_456',
      name: 'Salon 2',
    });

    await organization_repository.create(org1);
    await organization_repository.create(org2);

    const input = {
      ownerId: 'owner_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(1);
    expect(result[0].ownerId).toBe('owner_123');
    expect(result[0].name).toBe('Salon 1');
  });
});
