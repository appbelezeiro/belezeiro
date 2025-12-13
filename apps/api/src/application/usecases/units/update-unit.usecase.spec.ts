import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { UpdateUnitUseCase } from './update-unit.usecase';
import { InMemoryUnitRepository } from '@/infra/repositories/in-memory/units/in-memory-unit.repository';
import { InMemoryAmenityRepository } from '@/infra/repositories/in-memory/in-memory-amenity.repository';
import { InMemorySpecialtyRepository } from '@/infra/repositories/in-memory/in-memory-specialty.repository';
import { InMemoryServiceRepository } from '@/infra/repositories/in-memory/in-memory-service.repository';
import { UnitEntity } from '@/domain/entities/units/unit.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { UnitNotFoundError } from '@/domain/errors/units/unit.errors';
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
      complement: 'Apt 4',
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

describe('UpdateUnitUseCase', () => {
  let sut: UpdateUnitUseCase;
  let unit_repository: InMemoryUnitRepository;
  let amenity_repository: InMemoryAmenityRepository;
  let specialty_repository: InMemorySpecialtyRepository;
  let service_repository: InMemoryServiceRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    unit_repository = new InMemoryUnitRepository();
    amenity_repository = new InMemoryAmenityRepository();
    specialty_repository = new InMemorySpecialtyRepository();
    service_repository = new InMemoryServiceRepository();
    sut = new UpdateUnitUseCase(
      unit_repository,
      amenity_repository,
      specialty_repository,
      service_repository,
    );
  });

  it('should update unit name', async () => {
    const unit = createTestUnit({ name: 'Old Name' });

    await unit_repository.create(unit);

    const result = await sut.execute({
      id: unit.id,
      name: 'New Name',
    });

    expect(result.name).toBe('New Name');
  });

  it('should update unit logo', async () => {
    const unit = createTestUnit({ name: 'Unit' });

    await unit_repository.create(unit);

    const result = await sut.execute({
      id: unit.id,
      logo: 'https://example.com/logo.png',
    });

    expect(result.logo?.toString()).toBe('https://example.com/logo.png');
  });

  it('should activate unit', async () => {
    const unit = createTestUnit({ name: 'Unit', active: false });

    await unit_repository.create(unit);

    const result = await sut.execute({
      id: unit.id,
      active: true,
    });

    expect(result.active).toBe(true);
  });

  it('should deactivate unit', async () => {
    const unit = createTestUnit({ name: 'Unit', active: true });

    await unit_repository.create(unit);

    const result = await sut.execute({
      id: unit.id,
      active: false,
    });

    expect(result.active).toBe(false);
  });

  it('should update multiple fields at once', async () => {
    const unit = createTestUnit({ name: 'Old Name' });

    await unit_repository.create(unit);

    const result = await sut.execute({
      id: unit.id,
      name: 'New Name',
      logo: 'https://example.com/logo.png',
      active: false,
    });

    expect(result.name).toBe('New Name');
    expect(result.logo?.toString()).toBe('https://example.com/logo.png');
    expect(result.active).toBe(false);
  });

  it('should throw UnitNotFoundError when unit does not exist', async () => {
    await expect(
      sut.execute({
        id: 'unit_nonexistent',
        name: 'New Name',
      })
    ).rejects.toThrow(UnitNotFoundError);
  });
});
