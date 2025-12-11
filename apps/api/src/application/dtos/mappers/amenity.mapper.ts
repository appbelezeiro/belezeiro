import { AmenityEntity } from '@/domain/entities/amenity.entity';
import { AmenityDTO, AmenitySummaryDTO } from '../amenity.dto';

export class AmenityMapper {
  static toDTO(entity: AmenityEntity): AmenityDTO {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      icon: entity.icon,
      is_predefined: entity.is_predefined,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toSummary(entity: AmenityEntity): AmenitySummaryDTO {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      icon: entity.icon,
    };
  }

  static toDTOList(entities: AmenityEntity[]): AmenityDTO[] {
    return entities.map((e) => this.toDTO(e));
  }

  static toSummaryList(entities: AmenityEntity[]): AmenitySummaryDTO[] {
    return entities.map((e) => this.toSummary(e));
  }
}
