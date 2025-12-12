import { UnitSpecialty as PrismaUnitSpecialty } from '@prisma/client';
import { UnitSpecialtyEntity } from '@/domain/entities/unit-specialty.entity.js';

export class UnitSpecialtyDataMapper {
  static toDomain(raw: PrismaUnitSpecialty): UnitSpecialtyEntity {
    return new UnitSpecialtyEntity({
      id: raw.id,
      unit_id: raw.unit_id,
      specialty_id: raw.specialty_id,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: UnitSpecialtyEntity): Omit<PrismaUnitSpecialty, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      specialty_id: entity.specialty_id,
    };
  }

  static toPrismaCreate(entity: UnitSpecialtyEntity): Omit<PrismaUnitSpecialty, 'updated_at'> {
    return {
      ...UnitSpecialtyDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    };
  }
}
