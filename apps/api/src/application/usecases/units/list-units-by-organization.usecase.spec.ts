import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { ListUnitsByOrganizationUseCase } from './list-units-by-organization.usecase';
import { InMemoryUnitRepository } from '@/infra/repositories/in-memory/units/in-memory-unit.repository';
import { UnitEntity } from '@/domain/entities/units/unit.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

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
    const unit1 = new UnitEntity({
      organizationId: 'org_123',
      name: 'Unit Downtown',
      whatsapp: '+5511999999999',
      address: {
        street: 'Main St',
        number: '123',
        neighborhood: 'Downtown',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
      },
      professions: [],
      services: [],
      serviceType: 'local',
      amenities: [],
      workingHours: {
        monday: { open: '09:00', close: '18:00', enabled: true },
        tuesday: { open: '09:00', close: '18:00', enabled: true },
        wednesday: { open: '09:00', close: '18:00', enabled: true },
        thursday: { open: '09:00', close: '18:00', enabled: true },
        friday: { open: '09:00', close: '18:00', enabled: true },
        saturday: { open: '09:00', close: '18:00', enabled: true },
        sunday: { open: '09:00', close: '18:00', enabled: false },
      },
    });

    const unit2 = new UnitEntity({
      organizationId: 'org_123',
      name: 'Unit Uptown',
      whatsapp: '+5511888888888',
      address: {
        street: 'Second St',
        number: '456',
        neighborhood: 'Uptown',
        city: 'São Paulo',
        state: 'SP',
        cep: '02000-000',
      },
      professions: [],
      services: [],
      serviceType: 'local',
      amenities: [],
      workingHours: {
        monday: { open: '09:00', close: '18:00', enabled: true },
        tuesday: { open: '09:00', close: '18:00', enabled: true },
        wednesday: { open: '09:00', close: '18:00', enabled: true },
        thursday: { open: '09:00', close: '18:00', enabled: true },
        friday: { open: '09:00', close: '18:00', enabled: true },
        saturday: { open: '09:00', close: '18:00', enabled: true },
        sunday: { open: '09:00', close: '18:00', enabled: false },
      },
    });

    await unit_repository.create(unit1);
    await unit_repository.create(unit2);

    const input = {
      organizationId: 'org_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(2);
    expect(result[0].organizationId).toBe('org_123');
    expect(result[1].organizationId).toBe('org_123');
  });

  it('should return empty array when organization has no units', async () => {
    const input = {
      organizationId: 'org_without_units',
    };

    const result = await sut.execute(input);

    expect(result).toEqual([]);
  });

  it('should not return units from other organizations', async () => {
    const unit1 = new UnitEntity({
      organizationId: 'org_123',
      name: 'Unit 1',
      whatsapp: '+5511999999999',
      address: {
        street: 'Main St',
        number: '123',
        neighborhood: 'Downtown',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
      },
      professions: [],
      services: [],
      serviceType: 'local',
      amenities: [],
      workingHours: {
        monday: { open: '09:00', close: '18:00', enabled: true },
        tuesday: { open: '09:00', close: '18:00', enabled: true },
        wednesday: { open: '09:00', close: '18:00', enabled: true },
        thursday: { open: '09:00', close: '18:00', enabled: true },
        friday: { open: '09:00', close: '18:00', enabled: true },
        saturday: { open: '09:00', close: '18:00', enabled: true },
        sunday: { open: '09:00', close: '18:00', enabled: false },
      },
    });

    const unit2 = new UnitEntity({
      organizationId: 'org_456',
      name: 'Unit 2',
      whatsapp: '+5511888888888',
      address: {
        street: 'Second St',
        number: '456',
        neighborhood: 'Uptown',
        city: 'São Paulo',
        state: 'SP',
        cep: '02000-000',
      },
      professions: [],
      services: [],
      serviceType: 'local',
      amenities: [],
      workingHours: {
        monday: { open: '09:00', close: '18:00', enabled: true },
        tuesday: { open: '09:00', close: '18:00', enabled: true },
        wednesday: { open: '09:00', close: '18:00', enabled: true },
        thursday: { open: '09:00', close: '18:00', enabled: true },
        friday: { open: '09:00', close: '18:00', enabled: true },
        saturday: { open: '09:00', close: '18:00', enabled: true },
        sunday: { open: '09:00', close: '18:00', enabled: false },
      },
    });

    await unit_repository.create(unit1);
    await unit_repository.create(unit2);

    const input = {
      organizationId: 'org_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(1);
    expect(result[0].organizationId).toBe('org_123');
  });

  it('should return units with all properties', async () => {
    const unit = new UnitEntity({
      organizationId: 'org_123',
      name: 'Complete Unit',
      logo: 'https://example.com/logo.png',
      gallery: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
      whatsapp: '+5511999999999',
      phone: '+551133333333',
      address: {
        street: 'Complete St',
        number: '789',
        neighborhood: 'Central',
        city: 'São Paulo',
        state: 'SP',
        cep: '03000-000',
      },
      professions: [{ id: 'prof_1', name: 'Hairdresser', icon: 'scissors' }],
      services: [{ id: 'svc_1', name: 'Haircut', professionId: 'prof_1' }],
      serviceType: 'both',
      amenities: ['wifi', 'parking'],
      workingHours: {
        monday: { open: '09:00', close: '18:00', enabled: true },
        tuesday: { open: '09:00', close: '18:00', enabled: true },
        wednesday: { open: '09:00', close: '18:00', enabled: true },
        thursday: { open: '09:00', close: '18:00', enabled: true },
        friday: { open: '09:00', close: '18:00', enabled: true },
        saturday: { open: '09:00', close: '18:00', enabled: true },
        sunday: { open: '09:00', close: '18:00', enabled: false },
      },
    });

    await unit_repository.create(unit);

    const input = {
      organizationId: 'org_123',
    };

    const result = await sut.execute(input);

    expect(result[0].name).toBe('Complete Unit');
    expect(result[0].logo).toBe('https://example.com/logo.png');
    expect(result[0].gallery).toHaveLength(2);
    expect(result[0].professions).toHaveLength(1);
    expect(result[0].services).toHaveLength(1);
    expect(result[0].serviceType).toBe('both');
    expect(result[0].amenities).toContain('wifi');
  });

  it('should return both active and inactive units', async () => {
    const active_unit = new UnitEntity({
      organizationId: 'org_123',
      name: 'Active Unit',
      whatsapp: '+5511999999999',
      address: {
        street: 'Main St',
        number: '123',
        neighborhood: 'Downtown',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
      },
      professions: [],
      services: [],
      serviceType: 'local',
      amenities: [],
      workingHours: {
        monday: { open: '09:00', close: '18:00', enabled: true },
        tuesday: { open: '09:00', close: '18:00', enabled: true },
        wednesday: { open: '09:00', close: '18:00', enabled: true },
        thursday: { open: '09:00', close: '18:00', enabled: true },
        friday: { open: '09:00', close: '18:00', enabled: true },
        saturday: { open: '09:00', close: '18:00', enabled: true },
        sunday: { open: '09:00', close: '18:00', enabled: false },
      },
    });

    const inactive_unit = new UnitEntity({
      organizationId: 'org_123',
      name: 'Inactive Unit',
      whatsapp: '+5511888888888',
      address: {
        street: 'Second St',
        number: '456',
        neighborhood: 'Uptown',
        city: 'São Paulo',
        state: 'SP',
        cep: '02000-000',
      },
      professions: [],
      services: [],
      serviceType: 'local',
      amenities: [],
      workingHours: {
        monday: { open: '09:00', close: '18:00', enabled: true },
        tuesday: { open: '09:00', close: '18:00', enabled: true },
        wednesday: { open: '09:00', close: '18:00', enabled: true },
        thursday: { open: '09:00', close: '18:00', enabled: true },
        friday: { open: '09:00', close: '18:00', enabled: true },
        saturday: { open: '09:00', close: '18:00', enabled: true },
        sunday: { open: '09:00', close: '18:00', enabled: false },
      },
    });

    inactive_unit.deactivate();

    await unit_repository.create(active_unit);
    await unit_repository.create(inactive_unit);

    const input = {
      organizationId: 'org_123',
    };

    const result = await sut.execute(input);

    expect(result).toHaveLength(2);
    expect(result.some((u) => u.isActive)).toBe(true);
    expect(result.some((u) => !u.isActive)).toBe(true);
  });
});
