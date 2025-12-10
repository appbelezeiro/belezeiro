import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { ListActiveUnitsUseCase } from './list-active-units.usecase';
import { InMemoryUnitRepository } from '@/infra/repositories/in-memory/units/in-memory-unit.repository';
import { UnitEntity } from '@/domain/entities/units/unit.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

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
    const unit1 = new UnitEntity({
      organizationId: 'org_123',
      name: 'Unit 1',
      whatsapp: '+5511999999999',
      address: {
        street: 'Main St',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
        country: 'BR',
      },
      professions: [],
      services: [],
      serviceType: 'in_person',
    });

    const unit2 = new UnitEntity({
      organizationId: 'org_123',
      name: 'Unit 2',
      whatsapp: '+5511888888888',
      address: {
        street: 'Second St',
        number: '456',
        city: 'São Paulo',
        state: 'SP',
        cep: '02000-000',
        country: 'BR',
      },
      professions: [],
      services: [],
      serviceType: 'in_person',
    });

    await unit_repository.create(unit1);
    await unit_repository.create(unit2);

    const result = await sut.execute();

    expect(result).toHaveLength(2);
    expect(result[0].isActive).toBe(true);
    expect(result[1].isActive).toBe(true);
  });

  it('should not return inactive units', async () => {
    const active_unit = new UnitEntity({
      organizationId: 'org_123',
      name: 'Active Unit',
      whatsapp: '+5511999999999',
      address: {
        street: 'Main St',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
        country: 'BR',
      },
      professions: [],
      services: [],
      serviceType: 'in_person',
    });

    const inactive_unit = new UnitEntity({
      organizationId: 'org_123',
      name: 'Inactive Unit',
      whatsapp: '+5511888888888',
      address: {
        street: 'Second St',
        number: '456',
        city: 'São Paulo',
        state: 'SP',
        cep: '02000-000',
        country: 'BR',
      },
      professions: [],
      services: [],
      serviceType: 'in_person',
    });

    inactive_unit.deactivate();

    await unit_repository.create(active_unit);
    await unit_repository.create(inactive_unit);

    const result = await sut.execute();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Active Unit');
    expect(result[0].isActive).toBe(true);
  });

  it('should return empty array when no active units exist', async () => {
    const result = await sut.execute();

    expect(result).toEqual([]);
  });

  it('should return empty array when all units are inactive', async () => {
    const unit1 = new UnitEntity({
      organizationId: 'org_123',
      name: 'Inactive Unit 1',
      whatsapp: '+5511999999999',
      address: {
        street: 'Main St',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
        country: 'BR',
      },
      professions: [],
      services: [],
      serviceType: 'in_person',
    });

    const unit2 = new UnitEntity({
      organizationId: 'org_123',
      name: 'Inactive Unit 2',
      whatsapp: '+5511888888888',
      address: {
        street: 'Second St',
        number: '456',
        city: 'São Paulo',
        state: 'SP',
        cep: '02000-000',
        country: 'BR',
      },
      professions: [],
      services: [],
      serviceType: 'in_person',
    });

    unit1.deactivate();
    unit2.deactivate();

    await unit_repository.create(unit1);
    await unit_repository.create(unit2);

    const result = await sut.execute();

    expect(result).toEqual([]);
  });

  it('should return active units from different organizations', async () => {
    const unit1 = new UnitEntity({
      organizationId: 'org_123',
      name: 'Unit Org 1',
      whatsapp: '+5511999999999',
      address: {
        street: 'Main St',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
        country: 'BR',
      },
      professions: [],
      services: [],
      serviceType: 'in_person',
    });

    const unit2 = new UnitEntity({
      organizationId: 'org_456',
      name: 'Unit Org 2',
      whatsapp: '+5511888888888',
      address: {
        street: 'Second St',
        number: '456',
        city: 'São Paulo',
        state: 'SP',
        cep: '02000-000',
        country: 'BR',
      },
      professions: [],
      services: [],
      serviceType: 'in_person',
    });

    await unit_repository.create(unit1);
    await unit_repository.create(unit2);

    const result = await sut.execute();

    expect(result).toHaveLength(2);
    expect(result.some((u) => u.organizationId === 'org_123')).toBe(true);
    expect(result.some((u) => u.organizationId === 'org_456')).toBe(true);
  });

  it('should return units with different service types', async () => {
    const in_person_unit = new UnitEntity({
      organizationId: 'org_123',
      name: 'In Person Unit',
      whatsapp: '+5511999999999',
      address: {
        street: 'Main St',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
        country: 'BR',
      },
      professions: [],
      services: [],
      serviceType: 'in_person',
    });

    const remote_unit = new UnitEntity({
      organizationId: 'org_123',
      name: 'Remote Unit',
      whatsapp: '+5511888888888',
      address: {
        street: 'Second St',
        number: '456',
        city: 'São Paulo',
        state: 'SP',
        cep: '02000-000',
        country: 'BR',
      },
      professions: [],
      services: [],
      serviceType: 'remote',
    });

    const hybrid_unit = new UnitEntity({
      organizationId: 'org_123',
      name: 'Hybrid Unit',
      whatsapp: '+5511777777777',
      address: {
        street: 'Third St',
        number: '789',
        city: 'São Paulo',
        state: 'SP',
        cep: '03000-000',
        country: 'BR',
      },
      professions: [],
      services: [],
      serviceType: 'hybrid',
    });

    await unit_repository.create(in_person_unit);
    await unit_repository.create(remote_unit);
    await unit_repository.create(hybrid_unit);

    const result = await sut.execute();

    expect(result).toHaveLength(3);
    expect(result.some((u) => u.serviceType === 'in_person')).toBe(true);
    expect(result.some((u) => u.serviceType === 'remote')).toBe(true);
    expect(result.some((u) => u.serviceType === 'hybrid')).toBe(true);
  });
});
