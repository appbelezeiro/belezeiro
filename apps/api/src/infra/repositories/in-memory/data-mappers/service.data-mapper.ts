import { ServiceEntity } from '@/domain/entities/service.entity';

export interface ServicePersistence {
  id: string;
  specialty_id: string;
  code: string;
  name: string;
  description?: string;
  default_duration_minutes: number;
  default_price_cents: number;
  is_predefined: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export class ServiceDataMapper {
  static toDomain(raw: ServicePersistence): ServiceEntity {
    return new ServiceEntity({
      id: raw.id,
      specialty_id: raw.specialty_id,
      code: raw.code,
      name: raw.name,
      description: raw.description,
      default_duration_minutes: raw.default_duration_minutes,
      default_price_cents: raw.default_price_cents,
      is_predefined: raw.is_predefined,
      is_active: raw.is_active,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: ServiceEntity): ServicePersistence {
    return {
      id: entity.id,
      specialty_id: entity.specialty_id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      default_duration_minutes: entity.default_duration_minutes,
      default_price_cents: entity.default_price_cents,
      is_predefined: entity.is_predefined,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
