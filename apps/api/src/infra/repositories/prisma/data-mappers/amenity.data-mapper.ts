import { Amenity as PrismaAmenity } from '@prisma/client';
import { AmenityEntity } from '@/domain/entities/amenity.entity.js';

export class AmenityDataMapper {
  static toDomain(raw: PrismaAmenity): AmenityEntity {
    return new AmenityEntity({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description ?? undefined,
      icon: raw.icon,
      is_predefined: raw.is_predefined,
      is_active: raw.is_active,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: AmenityEntity): Omit<PrismaAmenity, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description ?? null,
      icon: entity.icon,
      is_predefined: entity.is_predefined,
      is_active: entity.is_active,
    };
  }

  static toPrismaCreate(entity: AmenityEntity): Omit<PrismaAmenity, 'updated_at'> {
    return {
      ...AmenityDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    };
  }
}
