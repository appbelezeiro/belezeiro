import { UnitEntity } from '@/domain/entities/unit.entity';
import { UnitDTO, UnitSummaryDTO, UnitListItemDTO } from '../unit.dto';

export class UnitMapper {
  static toDTO(entity: UnitEntity): UnitDTO {
    return {
      id: entity.id,
      organizationId: entity.organizationId,
      name: entity.name,
      logo: entity.logo,
      gallery: entity.gallery,
      isActive: entity.isActive,
      whatsapp: entity.whatsapp,
      phone: entity.phone,
      address: entity.address,
      professions: entity.professions,
      services: entity.services,
      serviceType: entity.serviceType,
      amenities: entity.amenities,
      workingHours: entity.workingHours,
      lunchBreak: entity.lunchBreak,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toSummary(entity: UnitEntity): UnitSummaryDTO {
    return {
      id: entity.id,
      organizationId: entity.organizationId,
      name: entity.name,
      logo: entity.logo,
      isActive: entity.isActive,
      serviceType: entity.serviceType,
    };
  }

  static toListItem(entity: UnitEntity): UnitListItemDTO {
    return {
      id: entity.id,
      name: entity.name,
      logo: entity.logo,
      isActive: entity.isActive,
      address: {
        city: entity.address.city,
        state: entity.address.state,
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
