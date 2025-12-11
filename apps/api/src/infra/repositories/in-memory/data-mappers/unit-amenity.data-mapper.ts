import { UnitAmenityEntity } from '@/domain/entities/unit-amenity.entity';

export interface UnitAmenityPersistence {
  id: string;
  unit_id: string;
  amenity_id: string;
  created_at: Date;
  updated_at: Date;
}

export class UnitAmenityDataMapper {
  static toDomain(raw: UnitAmenityPersistence): UnitAmenityEntity {
    return new UnitAmenityEntity({
      id: raw.id,
      unit_id: raw.unit_id,
      amenity_id: raw.amenity_id,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: UnitAmenityEntity): UnitAmenityPersistence {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      amenity_id: entity.amenity_id,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
