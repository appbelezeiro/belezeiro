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
      name: 'Beauty Salon',
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
    };

    const result = await sut.execute(input);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(organization.id);
    expect(result?.name).toBe('Beauty Salon');
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
      name: 'Premium Spa',
    });

    await organization_repository.create(organization);

    const input = {
      id: organization.id,
    };

    const result = await sut.execute(input);

    expect(result?.ownerId).toBe('owner_123');
    expect(result?.name).toBe('Premium Spa');
    expect(result?.id).toContain('org_');
  });

  it('should return correct organization when multiple exist', async () => {
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

    const result = await sut.execute({ id: org2.id });

    expect(result?.id).toBe(org2.id);
    expect(result?.name).toBe('Salon 2');
    expect(result?.ownerId).toBe('owner_456');
  });
});
