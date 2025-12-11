import { AmenityEntity } from '@/domain/entities/amenity.entity';

export interface AmenityPersistence {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon: string;
  is_predefined: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class AmenityDataMapper {
  static toDomain(raw: AmenityPersistence): AmenityEntity {
    return new AmenityEntity({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description,
      icon: raw.icon,
      is_predefined: raw.is_predefined,
      is_active: raw.is_active,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: AmenityEntity): AmenityPersistence {
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
}
