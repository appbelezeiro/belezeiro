import { UnitSpecialtyEntity } from '@/domain/entities/unit-specialty.entity';

export interface UnitSpecialtyPersistence {
  id: string;
  unit_id: string;
  specialty_id: string;
  created_at: Date;
  updated_at: Date;
}

export class UnitSpecialtyDataMapper {
  static toDomain(raw: UnitSpecialtyPersistence): UnitSpecialtyEntity {
    return new UnitSpecialtyEntity({
      id: raw.id,
      unit_id: raw.unit_id,
      specialty_id: raw.specialty_id,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: UnitSpecialtyEntity): UnitSpecialtyPersistence {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      specialty_id: entity.specialty_id,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
