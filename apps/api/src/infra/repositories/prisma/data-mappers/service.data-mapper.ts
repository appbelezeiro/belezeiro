import { Service as PrismaService } from '@prisma/client';
import { ServiceEntity } from '@/domain/entities/service.entity.js';

export class ServiceDataMapper {
  static toDomain(raw: PrismaService): ServiceEntity {
    return new ServiceEntity({
      id: raw.id,
      specialty_id: raw.specialty_id,
      code: raw.code,
      name: raw.name,
      description: raw.description ?? undefined,
      default_duration_minutes: raw.default_duration_minutes,
      default_price_cents: raw.default_price_cents,
      is_predefined: raw.is_predefined,
      is_active: raw.is_active,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: ServiceEntity): Omit<PrismaService, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      specialty_id: entity.specialty_id,
      code: entity.code,
      name: entity.name,
      description: entity.description ?? null,
      default_duration_minutes: entity.default_duration_minutes,
      default_price_cents: entity.default_price_cents,
      is_predefined: entity.is_predefined,
      is_active: entity.is_active,
    };
  }

  static toPrismaCreate(entity: ServiceEntity): Omit<PrismaService, 'updated_at'> {
    return {
      ...ServiceDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    };
  }
}
