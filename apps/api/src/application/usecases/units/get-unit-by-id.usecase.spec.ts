import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GetUnitByIdUseCase } from './get-unit-by-id.usecase';
import { InMemoryUnitRepository } from '@/infra/repositories/in-memory/units/in-memory-unit.repository';
import { UnitEntity } from '@/domain/entities/units/unit.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('GetUnitByIdUseCase', () => {
  let sut: GetUnitByIdUseCase;
  let unit_repository: InMemoryUnitRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    unit_repository = new InMemoryUnitRepository();
    sut = new GetUnitByIdUseCase(unit_repository);
  });

  it('should return unit by id', async () => {
    const unit = new UnitEntity({
      organizationId: 'org_123',
      name: 'Beauty Salon Downtown',
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

    await unit_repository.create(unit);

    const input = {
      id: unit.id,
    };

    const result = await sut.execute(input);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(unit.id);
    expect(result?.name).toBe('Beauty Salon Downtown');
  });

  it('should return null when unit does not exist', async () => {
    const input = {
      id: 'non_existent_id',
    };

    const result = await sut.execute(input);

    expect(result).toBeNull();
  });

  it('should return unit with all properties', async () => {
    const unit = new UnitEntity({
      organizationId: 'org_123',
      name: 'Complete Salon',
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
        complement: 'Suite 100',
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
      lunchBreak: {
        start: '12:00',
        end: '13:00',
        enabled: true,
      },
    });

    await unit_repository.create(unit);

    const input = {
      id: unit.id,
    };

    const result = await sut.execute(input);

    expect(result?.name).toBe('Complete Salon');
    expect(result?.logo).toBe('https://example.com/logo.png');
    expect(result?.gallery).toHaveLength(2);
    expect(result?.professions).toHaveLength(1);
    expect(result?.services).toHaveLength(1);
    expect(result?.serviceType).toBe('both');
    expect(result?.amenities).toContain('wifi');
    expect(result?.workingHours).toBeDefined();
    expect(result?.lunchBreak).toBeDefined();
  });

  it('should return active unit', async () => {
    const unit = new UnitEntity({
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

    await unit_repository.create(unit);

    const input = {
      id: unit.id,
    };

    const result = await sut.execute(input);

    expect(result?.isActive).toBe(true);
  });

  it('should return inactive unit', async () => {
    const unit = new UnitEntity({
      organizationId: 'org_123',
      name: 'Inactive Unit',
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

    unit.deactivate();
    await unit_repository.create(unit);

    const input = {
      id: unit.id,
    };

    const result = await sut.execute(input);

    expect(result?.isActive).toBe(false);
  });

  it('should return unit with different service types', async () => {
    const serviceTypes = ['local', 'home', 'both'] as const;

    for (const serviceType of serviceTypes) {
      const unit = new UnitEntity({
        organizationId: 'org_123',
        name: `Unit ${serviceType}`,
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
        serviceType,
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

      await unit_repository.create(unit);

      const input = {
        id: unit.id,
      };

      const result = await sut.execute(input);

      expect(result?.serviceType).toBe(serviceType);
    }
  });
});
