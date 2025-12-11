import { UnitServiceEntity } from '@/domain/entities/unit-service.entity';

export interface UnitServicePersistence {
  id: string;
  unit_id: string;
  service_id: string;
  custom_price_cents?: number;
  custom_duration_minutes?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class UnitServiceDataMapper {
  static toDomain(raw: UnitServicePersistence): UnitServiceEntity {
    return new UnitServiceEntity({
      id: raw.id,
      unit_id: raw.unit_id,
      service_id: raw.service_id,
      custom_price_cents: raw.custom_price_cents,
      custom_duration_minutes: raw.custom_duration_minutes,
      is_active: raw.is_active,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: UnitServiceEntity): UnitServicePersistence {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      service_id: entity.service_id,
      custom_price_cents: entity.custom_price_cents,
      custom_duration_minutes: entity.custom_duration_minutes,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
