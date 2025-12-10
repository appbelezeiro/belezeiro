import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { UpdateUnitUseCase } from './update-unit.usecase';
import { InMemoryUnitRepository } from '@/infra/repositories/in-memory/units/in-memory-unit.repository';
import { UnitEntity } from '@/domain/entities/units/unit.entity';
import type { ServiceType } from '@/domain/entities/units/unit.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { UnitNotFoundError } from '@/domain/errors/units/unit.errors';

describe('UpdateUnitUseCase', () => {
  let sut: UpdateUnitUseCase;
  let unit_repository: InMemoryUnitRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    unit_repository = new InMemoryUnitRepository();
    sut = new UpdateUnitUseCase(unit_repository);
  });

  it('should update unit name', async () => {
    const unit = new UnitEntity({
      name: 'Old Name',
      organizationId: 'org_123',
      whatsapp: '+5511999999999',
      address: {
        street: 'Main St',
        number: '123',
        complement: 'Apt 4',
        neighborhood: 'Downtown',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
        country: 'Brazil',
      },
      professions: [],
      services: [],
      serviceType: 'local',
    });

    await unit_repository.create(unit);

    const result = await sut.execute({
      id: unit.id,
      name: 'New Name',
    });

    expect(result.name).toBe('New Name');
  });

  it('should update unit logo', async () => {
    const unit = new UnitEntity({
      name: 'Unit',
      organizationId: 'org_123',
      whatsapp: '+5511999999999',
      address: {
        street: 'Main St',
        number: '123',
        complement: 'Apt 4',
        neighborhood: 'Downtown',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
        country: 'Brazil',
      },
      professions: [],
      services: [],
      serviceType: 'local',
    });

    await unit_repository.create(unit);

    const result = await sut.execute({
      id: unit.id,
      logo: 'https://example.com/logo.png',
    });

    expect(result.logo).toBe('https://example.com/logo.png');
  });

  it('should activate unit', async () => {
    const unit = new UnitEntity({
      name: 'Unit',
      organizationId: 'org_123',
      whatsapp: '+5511999999999',
      isActive: false,
      address: {
        street: 'Main St',
        number: '123',
        complement: 'Apt 4',
        neighborhood: 'Downtown',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
        country: 'Brazil',
      },
      professions: [],
      services: [],
      serviceType: 'local',
    });

    await unit_repository.create(unit);

    const result = await sut.execute({
      id: unit.id,
      isActive: true,
    });

    expect(result.isActive).toBe(true);
  });

  it('should deactivate unit', async () => {
    const unit = new UnitEntity({
      name: 'Unit',
      organizationId: 'org_123',
      whatsapp: '+5511999999999',
      isActive: true,
      address: {
        street: 'Main St',
        number: '123',
        complement: 'Apt 4',
        neighborhood: 'Downtown',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
        country: 'Brazil',
      },
      professions: [],
      services: [],
      serviceType: 'local',
    });

    await unit_repository.create(unit);

    const result = await sut.execute({
      id: unit.id,
      isActive: false,
    });

    expect(result.isActive).toBe(false);
  });

  it('should update unit contact info', async () => {
    const unit = new UnitEntity({
      name: 'Unit',
      organizationId: 'org_123',
      whatsapp: '+5511999999999',
      address: {
        street: 'Main St',
        number: '123',
        complement: 'Apt 4',
        neighborhood: 'Downtown',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
        country: 'Brazil',
      },
      professions: [],
      services: [],
      serviceType: 'local',
    });

    await unit_repository.create(unit);

    const result = await sut.execute({
      id: unit.id,
      whatsapp: '+5511888888888',
      phone: '+551133333333',
    });

    expect(result.whatsapp).toBe('+5511888888888');
    expect(result.phone).toBe('+551133333333');
  });

  it('should update multiple fields at once', async () => {
    const unit = new UnitEntity({
      name: 'Old Name',
      organizationId: 'org_123',
      whatsapp: '+5511999999999',
      address: {
        street: 'Main St',
        number: '123',
        complement: 'Apt 4',
        neighborhood: 'Downtown',
        city: 'São Paulo',
        state: 'SP',
        cep: '01000-000',
        country: 'Brazil',
      },
      professions: [],
      services: [],
      serviceType: 'local',
    });

    await unit_repository.create(unit);

    const result = await sut.execute({
      id: unit.id,
      name: 'New Name',
      logo: 'https://example.com/logo.png',
      isActive: false,
    });

    expect(result.name).toBe('New Name');
    expect(result.logo).toBe('https://example.com/logo.png');
    expect(result.isActive).toBe(false);
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
