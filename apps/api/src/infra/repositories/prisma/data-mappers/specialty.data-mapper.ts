import { Specialty as PrismaSpecialty } from '@prisma/client';
import { SpecialtyEntity } from '@/domain/entities/specialty.entity.js';

export class SpecialtyDataMapper {
  static toDomain(raw: PrismaSpecialty): SpecialtyEntity {
    return new SpecialtyEntity({
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

  static toPrisma(entity: SpecialtyEntity): Omit<PrismaSpecialty, 'created_at' | 'updated_at'> {
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

  static toPrismaCreate(entity: SpecialtyEntity): Omit<PrismaSpecialty, 'updated_at'> {
    return {
      ...SpecialtyDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    };
  }
}
