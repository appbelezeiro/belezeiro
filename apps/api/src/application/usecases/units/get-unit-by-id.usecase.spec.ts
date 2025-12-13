import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GetUnitByIdUseCase } from './get-unit-by-id.usecase';
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
    const unit = createTestUnit({ name: 'Beauty Salon Downtown' });

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
    const unit = createTestUnit({
      name: 'Complete Salon',
      logo: 'https://example.com/logo.png',
      gallery: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
      serviceType: 'both',
    });

    await unit_repository.create(unit);

    const input = {
      id: unit.id,
    };

    const result = await sut.execute(input);

    expect(result?.name).toBe('Complete Salon');
    expect(result?.logo?.toString()).toBe('https://example.com/logo.png');
    expect(result?.gallery).toHaveLength(2);
    expect(result?.serviceType).toBe('both');
  });

  it('should return active unit', async () => {
    const unit = createTestUnit({ name: 'Active Unit' });

    await unit_repository.create(unit);

    const input = {
      id: unit.id,
    };

    const result = await sut.execute(input);

    expect(result?.active).toBe(true);
  });

  it('should return inactive unit', async () => {
    const unit = createTestUnit({ name: 'Inactive Unit' });

    unit.deactivate();
    await unit_repository.create(unit);

    const input = {
      id: unit.id,
    };

    const result = await sut.execute(input);

    expect(result?.active).toBe(false);
  });

  it('should return unit with different service types', async () => {
    const serviceTypes: UnitServiceType[] = ['on-site', 'home-care', 'both'];

    for (const serviceType of serviceTypes) {
      const unit = createTestUnit({
        name: `Unit ${serviceType}`,
        serviceType,
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
