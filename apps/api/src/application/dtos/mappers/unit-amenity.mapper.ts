import { UnitAmenityEntity } from '@/domain/entities/unit-amenity.entity';
import { AmenityEntity } from '@/domain/entities/amenity.entity';
import { UnitAmenityDTO, UnitAmenityWithDetailsDTO } from '../unit-amenity.dto';

export class UnitAmenityMapper {
  static toDTO(entity: UnitAmenityEntity): UnitAmenityDTO {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      amenity_id: entity.amenity_id,
      created_at: entity.created_at,
    };
  }

  static toWithDetails(
    entity: UnitAmenityEntity,
    amenity: AmenityEntity
  ): UnitAmenityWithDetailsDTO {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      amenity: {
        id: amenity.id,
        code: amenity.code,
        name: amenity.name,
        icon: amenity.icon,
        description: amenity.description,
      },
      created_at: entity.created_at,
    };
  }

  static toDTOList(entities: UnitAmenityEntity[]): UnitAmenityDTO[] {
    return entities.map((e) => this.toDTO(e));
  }
}
