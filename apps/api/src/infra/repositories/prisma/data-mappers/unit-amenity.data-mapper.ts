import { UnitAmenity as PrismaUnitAmenity } from '@prisma/client';
import { UnitAmenityEntity } from '@/domain/entities/unit-amenity.entity.js';

export class UnitAmenityDataMapper {
  static toDomain(raw: PrismaUnitAmenity): UnitAmenityEntity {
    return new UnitAmenityEntity({
      id: raw.id,
      unit_id: raw.unit_id,
      amenity_id: raw.amenity_id,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: UnitAmenityEntity): Omit<PrismaUnitAmenity, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      amenity_id: entity.amenity_id,
    };
  }

  static toPrismaCreate(entity: UnitAmenityEntity): Omit<PrismaUnitAmenity, 'updated_at'> {
    return {
      ...UnitAmenityDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    };
  }
}
