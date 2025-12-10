import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreateUnitUseCase } from './create-unit.usecase';
import { InMemoryUnitRepository } from '@/infra/repositories/in-memory/units/in-memory-unit.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('CreateUnitUseCase', () => {
  let sut: CreateUnitUseCase;
  let unit_repository: InMemoryUnitRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    unit_repository = new InMemoryUnitRepository();
    sut = new CreateUnitUseCase(unit_repository);
  });

  it('should create a new unit successfully', async () => {
    const input = {
      organizationId: 'org_123',
      name: 'Unidade Centro',
      whatsapp: '+5511999999999',
      address: {
        cep: '01310-100',
        street: 'Av. Paulista',
        number: '1000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
      },
      professions: [
        { id: 'prof_cabeleireiro', name: 'Cabeleireiro(a)', icon: '✂️' },
      ],
      services: [
        { id: 'serv_corte_feminino', name: 'Corte Feminino', professionId: 'prof_cabeleireiro' },
      ],
      serviceType: 'local' as const,
      amenities: ['wifi' as const, 'parking' as const],
      workingHours: {
        monday: { enabled: true, open: '09:00', close: '18:00' },
        tuesday: { enabled: true, open: '09:00', close: '18:00' },
        wednesday: { enabled: true, open: '09:00', close: '18:00' },
        thursday: { enabled: true, open: '09:00', close: '18:00' },
        friday: { enabled: true, open: '09:00', close: '18:00' },
        saturday: { enabled: true, open: '09:00', close: '14:00' },
        sunday: { enabled: false, open: '00:00', close: '00:00' },
      },
    };

    const result = await sut.execute(input);

    expect(result.name).toBe('Unidade Centro');
    expect(result.organizationId).toBe('org_123');
    expect(result.isActive).toBe(true);
    expect(result.id).toContain('unit_');
    expect(result.professions).toHaveLength(1);
    expect(result.services).toHaveLength(1);
  });

  it('should create unit with optional fields', async () => {
    const input = {
      organizationId: 'org_456',
      name: 'Unidade Jardins',
      logo: 'https://example.com/logo.png',
      gallery: ['https://example.com/photo1.jpg'],
      whatsapp: '+5511988888888',
      phone: '+5511988888887',
      address: {
        cep: '01310-100',
        street: 'Av. Paulista',
        number: '2000',
        complement: 'Sala 10',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
      },
      professions: [
        { id: 'prof_barbeiro', name: 'Barbeiro(a)', icon: '💈' },
      ],
      services: [
        { id: 'serv_corte_barba', name: 'Corte + Barba', professionId: 'prof_barbeiro' },
      ],
      serviceType: 'both' as const,
      amenities: ['wifi' as const, 'coffee' as const, 'ac' as const],
      workingHours: {
        monday: { enabled: true, open: '08:00', close: '20:00' },
        tuesday: { enabled: true, open: '08:00', close: '20:00' },
        wednesday: { enabled: true, open: '08:00', close: '20:00' },
        thursday: { enabled: true, open: '08:00', close: '20:00' },
        friday: { enabled: true, open: '08:00', close: '20:00' },
        saturday: { enabled: true, open: '08:00', close: '16:00' },
        sunday: { enabled: false, open: '00:00', close: '00:00' },
      },
      lunchBreak: {
        enabled: true,
        start: '12:00',
        end: '13:00',
      },
    };

    const result = await sut.execute(input);

    expect(result.logo).toBe('https://example.com/logo.png');
    expect(result.gallery).toHaveLength(1);
    expect(result.phone).toBe('+5511988888887');
    expect(result.address.complement).toBe('Sala 10');
    expect(result.lunchBreak?.enabled).toBe(true);
  });

  it('should throw error if CEP is invalid', async () => {
    const input = {
      organizationId: 'org_123',
      name: 'Test Unit',
      whatsapp: '+5511999999999',
      address: {
        cep: 'invalid',
        street: 'Street',
        number: '100',
        neighborhood: 'Neighborhood',
        city: 'City',
        state: 'SP',
      },
      professions: [
        { id: 'prof_cabeleireiro', name: 'Cabeleireiro(a)', icon: '✂️' },
      ],
      services: [
        { id: 'serv_corte_feminino', name: 'Corte Feminino', professionId: 'prof_cabeleireiro' },
      ],
      serviceType: 'local' as const,
      amenities: [],
      workingHours: {
        monday: { enabled: true, open: '09:00', close: '18:00' },
        tuesday: { enabled: true, open: '09:00', close: '18:00' },
        wednesday: { enabled: true, open: '09:00', close: '18:00' },
        thursday: { enabled: true, open: '09:00', close: '18:00' },
        friday: { enabled: true, open: '09:00', close: '18:00' },
        saturday: { enabled: false, open: '00:00', close: '00:00' },
        sunday: { enabled: false, open: '00:00', close: '00:00' },
      },
    };

    await expect(sut.execute(input)).rejects.toThrow();
  });

  it('should throw error if working hours open >= close', async () => {
    const input = {
      organizationId: 'org_123',
      name: 'Test Unit',
      whatsapp: '+5511999999999',
      address: {
        cep: '01310-100',
        street: 'Street',
        number: '100',
        neighborhood: 'Neighborhood',
        city: 'City',
        state: 'SP',
      },
      professions: [
        { id: 'prof_cabeleireiro', name: 'Cabeleireiro(a)', icon: '✂️' },
      ],
      services: [
        { id: 'serv_corte_feminino', name: 'Corte Feminino', professionId: 'prof_cabeleireiro' },
      ],
      serviceType: 'local' as const,
      amenities: [],
      workingHours: {
        monday: { enabled: true, open: '18:00', close: '09:00' }, // Invalid
        tuesday: { enabled: true, open: '09:00', close: '18:00' },
        wednesday: { enabled: true, open: '09:00', close: '18:00' },
        thursday: { enabled: true, open: '09:00', close: '18:00' },
        friday: { enabled: true, open: '09:00', close: '18:00' },
        saturday: { enabled: false, open: '00:00', close: '00:00' },
        sunday: { enabled: false, open: '00:00', close: '00:00' },
      },
    };

    await expect(sut.execute(input)).rejects.toThrow();
  });

  it('should throw error if service profession is not selected', async () => {
    const input = {
      organizationId: 'org_123',
      name: 'Test Unit',
      whatsapp: '+5511999999999',
      address: {
        cep: '01310-100',
        street: 'Street',
        number: '100',
        neighborhood: 'Neighborhood',
        city: 'City',
        state: 'SP',
      },
      professions: [
        { id: 'prof_cabeleireiro', name: 'Cabeleireiro(a)', icon: '✂️' },
      ],
      services: [
        // Service requires barbeiro profession but only cabeleireiro is selected
        { id: 'serv_corte_barba', name: 'Corte + Barba', professionId: 'prof_barbeiro' },
      ],
      serviceType: 'local' as const,
      amenities: [],
      workingHours: {
        monday: { enabled: true, open: '09:00', close: '18:00' },
        tuesday: { enabled: true, open: '09:00', close: '18:00' },
        wednesday: { enabled: true, open: '09:00', close: '18:00' },
        thursday: { enabled: true, open: '09:00', close: '18:00' },
        friday: { enabled: true, open: '09:00', close: '18:00' },
        saturday: { enabled: false, open: '00:00', close: '00:00' },
        sunday: { enabled: false, open: '00:00', close: '00:00' },
      },
    };

    await expect(sut.execute(input)).rejects.toThrow();
  });
});
