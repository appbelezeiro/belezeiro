import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { ListUnitsByOrganizationUseCase } from './list-units-by-organization.usecase';
import { InMemoryUnitRepository } from '@/infra/repositories/in-memory/units/in-memory-unit.repository';
import { UnitEntity } from '@/domain/entities/units/unit.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { UnitServiceType } from '@/domain/entities/units/unit.entity.types';

function createTestUnit(overrides: Partial<{
  orgId: string;
  name: string;
  serviceType: UnitServiceType;
  active: boolean;
  logo: string;
  gallery: string[];
}> = {}) {
  return new UnitEntity({
    orgId: overrides.orgId ?? 'org_123',
    name: overrides.name ?? 'Test Unit',
    logo: overrides.logo ?? '',
    gallery: overrides.gallery ?? [],
    phones: [{ raw_number: '+5511999999999' }],
    address: {
      street: 'Main St',
      number: '123',
      neighborhood: 'Downtown',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '01000-000',
    },
    especialidades: [],
    services: [],
    serviceType: overrides.serviceType ?? 'on-site',
    amenities: [],
    preferences: {},
    active: overrides.active,
  });
}

describe('ListUnitsByOrganizationUseCase', () => {
  let sut: ListUnitsByOrganizationUseCase;
  let unit_repository: InMemoryUnitRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    unit_repository = new InMemoryUnitRepository();
    sut = new ListUnitsByOrganizationUseCase(unit_repository);
  });

  it('should return all units for organization', async () => {
    const unit1 = createTestUnit({ name: 'Unit Downtown', orgId: 'org_123' });
    const unit2 = createTestUnit({ name: 'Unit Uptown', orgId: 'org_123' });

    await unit_repository.create(unit1);
    await unit_repository.create(unit2);

    const input = {
      organizationId: 'org_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(2);
    expect(result[0].orgId).toBe('org_123');
    expect(result[1].orgId).toBe('org_123');
  });

  it('should return empty array when organization has no units', async () => {
    const input = {
      organizationId: 'org_without_units',
    };

    const result = await sut.execute(input);

    expect(result).toEqual([]);
  });

  it('should not return units from other organizations', async () => {
    const unit1 = createTestUnit({ name: 'Unit 1', orgId: 'org_123' });
    const unit2 = createTestUnit({ name: 'Unit 2', orgId: 'org_456' });

    await unit_repository.create(unit1);
    await unit_repository.create(unit2);

    const input = {
      organizationId: 'org_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(1);
    expect(result[0].orgId).toBe('org_123');
  });

  it('should return units with all properties', async () => {
    const unit = createTestUnit({
      name: 'Complete Unit',
      orgId: 'org_123',
      logo: 'https://example.com/logo.png',
      gallery: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
      serviceType: 'both',
    });

    await unit_repository.create(unit);

    const input = {
      organizationId: 'org_123',
    };

    const result = await sut.execute(input);

    expect(result[0].name).toBe('Complete Unit');
    expect(result[0].logo?.toString()).toBe('https://example.com/logo.png');
    expect(result[0].gallery).toHaveLength(2);
    expect(result[0].serviceType).toBe('both');
  });

  it('should return both active and inactive units', async () => {
    const active_unit = createTestUnit({ name: 'Active Unit', orgId: 'org_123' });
    const inactive_unit = createTestUnit({ name: 'Inactive Unit', orgId: 'org_123' });

    inactive_unit.deactivate();

    await unit_repository.create(active_unit);
    await unit_repository.create(inactive_unit);

    const input = {
      organizationId: 'org_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(2);
    expect(result.some((u) => u.active)).toBe(true);
    expect(result.some((u) => !u.active)).toBe(true);
  });
});
