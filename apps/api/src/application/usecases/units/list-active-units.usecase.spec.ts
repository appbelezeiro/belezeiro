import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { ListActiveUnitsUseCase } from './list-active-units.usecase';
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
}> = {}) {
  return new UnitEntity({
    orgId: overrides.orgId ?? 'org_123',
    name: overrides.name ?? 'Test Unit',
    logo: '',
    gallery: [],
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

describe('ListActiveUnitsUseCase', () => {
  let sut: ListActiveUnitsUseCase;
  let unit_repository: InMemoryUnitRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    unit_repository = new InMemoryUnitRepository();
    sut = new ListActiveUnitsUseCase(unit_repository);
  });

  it('should return all active units', async () => {
    const unit1 = createTestUnit({ name: 'Unit 1' });
    const unit2 = createTestUnit({ name: 'Unit 2' });

    await unit_repository.create(unit1);
    await unit_repository.create(unit2);

    const result = await sut.execute();

    expect(result).toHaveLength(2);
    expect(result[0].active).toBe(true);
    expect(result[1].active).toBe(true);
  });

  it('should not return inactive units', async () => {
    const active_unit = createTestUnit({ name: 'Active Unit' });
    const inactive_unit = createTestUnit({ name: 'Inactive Unit' });

    inactive_unit.deactivate();

    await unit_repository.create(active_unit);
    await unit_repository.create(inactive_unit);

    const result = await sut.execute();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Active Unit');
    expect(result[0].active).toBe(true);
  });

  it('should return empty array when no active units exist', async () => {
    const result = await sut.execute();

    expect(result).toEqual([]);
  });

  it('should return empty array when all units are inactive', async () => {
    const unit1 = createTestUnit({ name: 'Inactive Unit 1' });
    const unit2 = createTestUnit({ name: 'Inactive Unit 2' });

    unit1.deactivate();
    unit2.deactivate();

    await unit_repository.create(unit1);
    await unit_repository.create(unit2);

    const result = await sut.execute();

    expect(result).toEqual([]);
  });

  it('should return active units from different organizations', async () => {
    const unit1 = createTestUnit({ name: 'Unit Org 1', orgId: 'org_123' });
    const unit2 = createTestUnit({ name: 'Unit Org 2', orgId: 'org_456' });

    await unit_repository.create(unit1);
    await unit_repository.create(unit2);

    const result = await sut.execute();

    expect(result).toHaveLength(2);
    expect(result.some((u) => u.orgId === 'org_123')).toBe(true);
    expect(result.some((u) => u.orgId === 'org_456')).toBe(true);
  });

  it('should return units with different service types', async () => {
    const local_unit = createTestUnit({ name: 'Local Unit', serviceType: 'on-site' });
    const home_unit = createTestUnit({ name: 'Home Unit', serviceType: 'home-care' });
    const both_unit = createTestUnit({ name: 'Both Unit', serviceType: 'both' });

    await unit_repository.create(local_unit);
    await unit_repository.create(home_unit);
    await unit_repository.create(both_unit);

    const result = await sut.execute();

    expect(result).toHaveLength(3);
    expect(result.some((u) => u.serviceType === 'on-site')).toBe(true);
    expect(result.some((u) => u.serviceType === 'home-care')).toBe(true);
    expect(result.some((u) => u.serviceType === 'both')).toBe(true);
  });
});
