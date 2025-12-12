import { UnitEntity } from '@/domain/entities/units/unit.entity';
import { SpecialtyEntity } from '@/domain/entities/specialty.entity';
import { ServiceEntity } from '@/domain/entities/service.entity';
import { AmenityEntity } from '@/domain/entities/amenity.entity';
import {
  UnitDTO,
  UnitSummaryDTO,
  UnitListItemDTO,
  SpecialtyDTO,
  ServiceDTO,
  AmenityDTO,
  AddressDTO,
  PhoneDTO,
} from '../../units/unit.dto';

export class UnitMapper {
  static specialtyToDTO(entity: SpecialtyEntity): SpecialtyDTO {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      icon: entity.icon,
      is_predefined: entity.is_predefined,
      is_active: entity.is_active,
    };
  }

  static serviceToDTO(entity: ServiceEntity): ServiceDTO {
    return {
      id: entity.id,
      specialty_id: entity.specialty_id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      default_duration_minutes: entity.default_duration_minutes,
      default_price_cents: entity.default_price_cents,
      is_predefined: entity.is_predefined,
      is_active: entity.is_active,
    };
  }

  static amenityToDTO(entity: AmenityEntity): AmenityDTO {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      icon: entity.icon,
      is_predefined: entity.is_predefined,
      is_active: entity.is_active,
    };
  }

  static toDTO(entity: UnitEntity): UnitDTO {
    const address: AddressDTO | null = entity.address
      ? {
          id: entity.address.id ?? '',
          street: entity.address.street,
          number: entity.address.number,
          neighborhood: entity.address.neighborhood,
          city: entity.address.city,
          state: entity.address.state,
          zipcode: entity.address.zipcode,
          country: entity.address.country,
          complement: entity.address.complement,
          reference: entity.address.reference,
          latitude: entity.address.latitude,
          longitude: entity.address.longitude,
          formatted: entity.address.formatted,
        }
      : null;

    const phones: PhoneDTO[] = entity.phones.map((p) => ({
      id: p.id ?? '',
      country_code: p.country_code,
      area_code: p.area_code,
      number: p.number,
      full_number: p.full_number,
      label: p.label,
      is_whatsapp: p.is_whatsapp,
      is_verified: p.is_verified,
    }));

    return {
      id: entity.id,
      orgId: entity.orgId,
      name: entity.name,
      preferences: entity.preferences,
      logo: entity.logo?.URL,
      gallery: entity.gallery.map((g) => g.URL),
      active: entity.active,
      phones,
      address,
      especialidades: entity.especialidades.map(UnitMapper.specialtyToDTO),
      services: entity.services.map(UnitMapper.serviceToDTO),
      serviceType: entity.serviceType,
      amenities: entity.amenities.map(UnitMapper.amenityToDTO),
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toSummary(entity: UnitEntity): UnitSummaryDTO {
    return {
      id: entity.id,
      orgId: entity.orgId,
      name: entity.name,
      logo: entity.logo?.URL,
      active: entity.active,
      serviceType: entity.serviceType,
    };
  }

  static toListItem(entity: UnitEntity): UnitListItemDTO {
    return {
      id: entity.id,
      name: entity.name,
      logo: entity.logo?.URL,
      active: entity.active,
      address: {
        city: entity.address?.city ?? '',
        state: entity.address?.state ?? '',
      },
    };
  }

  static toDTOList(entities: UnitEntity[]): UnitDTO[] {
    return entities.map(this.toDTO);
  }

  static toSummaryList(entities: UnitEntity[]): UnitSummaryDTO[] {
    return entities.map(this.toSummary);
  }

  static toListItemList(entities: UnitEntity[]): UnitListItemDTO[] {
    return entities.map(this.toListItem);
  }
}
