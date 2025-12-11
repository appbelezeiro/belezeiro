import { UnitServiceEntity } from '@/domain/entities/unit-service.entity';
import { ServiceEntity } from '@/domain/entities/service.entity';
import { SpecialtyEntity } from '@/domain/entities/specialty.entity';
import { UnitServiceDTO, UnitServiceWithDetailsDTO } from '../unit-service.dto';

export class UnitServiceMapper {
  static toDTO(entity: UnitServiceEntity): UnitServiceDTO {
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

  static toWithDetails(
    entity: UnitServiceEntity,
    service: ServiceEntity,
    specialty: SpecialtyEntity
  ): UnitServiceWithDetailsDTO {
    const final_price_cents = entity.custom_price_cents ?? service.default_price_cents;
    const final_duration_minutes =
      entity.custom_duration_minutes ?? service.default_duration_minutes;

    return {
      id: entity.id,
      unit_id: entity.unit_id,
      service: {
        id: service.id,
        code: service.code,
        name: service.name,
        description: service.description,
        default_duration_minutes: service.default_duration_minutes,
        default_price_cents: service.default_price_cents,
        specialty: {
          id: specialty.id,
          code: specialty.code,
          name: specialty.name,
          icon: specialty.icon,
        },
      },
      custom_price_cents: entity.custom_price_cents,
      custom_duration_minutes: entity.custom_duration_minutes,
      final_price_cents,
      final_duration_minutes,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toDTOList(entities: UnitServiceEntity[]): UnitServiceDTO[] {
    return entities.map((e) => this.toDTO(e));
  }
}
