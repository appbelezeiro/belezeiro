import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreateUnitUseCase } from './create-unit.usecase';
import { InMemoryUnitRepository } from '@/infra/repositories/in-memory/units/in-memory-unit.repository';
import { InMemoryAmenityRepository } from '@/infra/repositories/in-memory/in-memory-amenity.repository';
import { InMemorySpecialtyRepository } from '@/infra/repositories/in-memory/in-memory-specialty.repository';
import { InMemoryServiceRepository } from '@/infra/repositories/in-memory/in-memory-service.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { AmenityEntity } from '@/domain/entities/amenity.entity';
import { SpecialtyEntity } from '@/domain/entities/specialty.entity';
import { ServiceEntity } from '@/domain/entities/service.entity';
import { OneOrMoreAmenitiesNotFound } from '@/domain/errors/amenities/one-or-more-amenities-not-found.error';
import { OneOrMoreSpecialitiesNotFound } from '@/domain/errors/specialities/one-or-more-specialities-not-found.error';
import { OneOrMoreServicesNotFound } from '@/domain/errors/services/one-or-more-services-not-found.error';

describe('CreateUnitUseCase', () => {
  let sut: CreateUnitUseCase;
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
    sut = new CreateUnitUseCase(
      unit_repository,
      amenity_repository,
      specialty_repository,
      service_repository,
    );
  });

  it('should create a new unit successfully', async () => {
    const amenity = new AmenityEntity({
      id: 'amen_wifi',
      code: 'wifi',
      name: 'Wi-Fi',
      icon: '📶',
      is_predefined: true,
      is_active: true,
    });
    await amenity_repository.create(amenity);

    const specialty = new SpecialtyEntity({
      id: 'spec_hair',
      code: 'haircut',
      name: 'Cabeleireiro',
      icon: '✂️',
      is_predefined: true,
      is_active: true,
    });
    await specialty_repository.create(specialty);

    const service = new ServiceEntity({
      id: 'serv_corte',
      specialty_id: 'spec_hair',
      code: 'corte_feminino',
      name: 'Corte Feminino',
      default_duration_minutes: 60,
      default_price_cents: 5000,
      is_predefined: true,
      is_active: true,
    });
    await service_repository.create(service);

    const input = {
      orgId: 'org_123',
      name: 'Unidade Centro',
      logo: '',
      gallery: [],
      phones: [{ country_code: '+55', area_code: '11', number: '999999999' }],
      address: {
        street: 'Av. Paulista',
        number: '1000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipcode: '01310-100',
      },
      preferences: {},
      specalities: ['spec_hair'],
      services: ['serv_corte'],
      serviceType: 'on-site' as const,
      amenities: ['amen_wifi'],
    };

    const result = await sut.execute(input);

    expect(result.name).toBe('Unidade Centro');
    expect(result.orgId).toBe('org_123');
    expect(result.active).toBe(true);
    expect(result.id).toContain('unit_');
    expect(result.especialidades).toHaveLength(1);
    expect(result.services).toHaveLength(1);
    expect(result.amenities).toHaveLength(1);
  });

  it('should create unit with optional gallery', async () => {
    const amenity = new AmenityEntity({
      id: 'amen_parking',
      code: 'parking',
      name: 'Estacionamento',
      icon: '🚗',
      is_predefined: true,
      is_active: true,
    });
    await amenity_repository.create(amenity);

    const specialty = new SpecialtyEntity({
      id: 'spec_barber',
      code: 'barber',
      name: 'Barbeiro',
      icon: '💈',
      is_predefined: true,
      is_active: true,
    });
    await specialty_repository.create(specialty);

    const service = new ServiceEntity({
      id: 'serv_barba',
      specialty_id: 'spec_barber',
      code: 'corte_barba',
      name: 'Corte + Barba',
      default_duration_minutes: 45,
      default_price_cents: 4000,
      is_predefined: true,
      is_active: true,
    });
    await service_repository.create(service);

    const input = {
      orgId: 'org_456',
      name: 'Unidade Jardins',
      logo: 'https://example.com/logo.png',
      gallery: ['https://example.com/photo1.jpg'],
      phones: [{ country_code: '+55', area_code: '11', number: '988888888' }],
      address: {
        street: 'Av. Paulista',
        number: '2000',
        complement: 'Sala 10',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipcode: '01310-100',
      },
      preferences: {},
      specalities: ['spec_barber'],
      services: ['serv_barba'],
      serviceType: 'both' as const,
      amenities: ['amen_parking'],
    };

    const result = await sut.execute(input);

    expect(result.logo?.toString()).toBe('https://example.com/logo.png');
    expect(result.gallery).toHaveLength(1);
    expect(result.address?.complement).toBe('Sala 10');
  });

  it('should throw error if amenities not found', async () => {
    const specialty = new SpecialtyEntity({
      id: 'spec_hair',
      code: 'haircut',
      name: 'Cabeleireiro',
      icon: '✂️',
      is_predefined: true,
      is_active: true,
    });
    await specialty_repository.create(specialty);

    const service = new ServiceEntity({
      id: 'serv_corte',
      specialty_id: 'spec_hair',
      code: 'corte_feminino',
      name: 'Corte Feminino',
      default_duration_minutes: 60,
      default_price_cents: 5000,
      is_predefined: true,
      is_active: true,
    });
    await service_repository.create(service);

    const input = {
      orgId: 'org_123',
      name: 'Test Unit',
      logo: '',
      gallery: [],
      phones: [{ country_code: '+55', area_code: '11', number: '999999999' }],
      address: {
        street: 'Street',
        number: '100',
        neighborhood: 'Neighborhood',
        city: 'City',
        state: 'SP',
        zipcode: '01310-100',
      },
      preferences: {},
      specalities: ['spec_hair'],
      services: ['serv_corte'],
      serviceType: 'on-site' as const,
      amenities: ['nonexistent_amenity'],
    };

    await expect(sut.execute(input)).rejects.toThrow(OneOrMoreAmenitiesNotFound);
  });

  it('should throw error if specialties not found', async () => {
    const amenity = new AmenityEntity({
      id: 'amen_wifi',
      code: 'wifi',
      name: 'Wi-Fi',
      icon: '📶',
      is_predefined: true,
      is_active: true,
    });
    await amenity_repository.create(amenity);

    const input = {
      orgId: 'org_123',
      name: 'Test Unit',
      logo: '',
      gallery: [],
      phones: [{ country_code: '+55', area_code: '11', number: '999999999' }],
      address: {
        street: 'Street',
        number: '100',
        neighborhood: 'Neighborhood',
        city: 'City',
        state: 'SP',
        zipcode: '01310-100',
      },
      preferences: {},
      specalities: ['nonexistent_specialty'],
      services: [],
      serviceType: 'on-site' as const,
      amenities: ['amen_wifi'],
    };

    await expect(sut.execute(input)).rejects.toThrow(OneOrMoreSpecialitiesNotFound);
  });

  it('should throw error if services not found', async () => {
    const amenity = new AmenityEntity({
      id: 'amen_wifi',
      code: 'wifi',
      name: 'Wi-Fi',
      icon: '📶',
      is_predefined: true,
      is_active: true,
    });
    await amenity_repository.create(amenity);

    const specialty = new SpecialtyEntity({
      id: 'spec_hair',
      code: 'haircut',
      name: 'Cabeleireiro',
      icon: '✂️',
      is_predefined: true,
      is_active: true,
    });
    await specialty_repository.create(specialty);

    const input = {
      orgId: 'org_123',
      name: 'Test Unit',
      logo: '',
      gallery: [],
      phones: [{ country_code: '+55', area_code: '11', number: '999999999' }],
      address: {
        street: 'Street',
        number: '100',
        neighborhood: 'Neighborhood',
        city: 'City',
        state: 'SP',
        zipcode: '01310-100',
      },
      preferences: {},
      specalities: ['spec_hair'],
      services: ['nonexistent_service'],
      serviceType: 'on-site' as const,
      amenities: ['amen_wifi'],
    };

    await expect(sut.execute(input)).rejects.toThrow(OneOrMoreServicesNotFound);
  });
});
