import { ServiceEntity } from '@/domain/entities/service.entity';
import { SpecialtyEntity } from '@/domain/entities/specialty.entity';
import { ServiceDTO, ServiceWithSpecialtyDTO, ServiceSummaryDTO } from '../service.dto';

export class ServiceMapper {
  static toDTO(entity: ServiceEntity): ServiceDTO {
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

  static toWithSpecialty(entity: ServiceEntity, specialty: SpecialtyEntity): ServiceWithSpecialtyDTO {
    return {
      ...this.toDTO(entity),
      specialty: {
        id: specialty.id,
        code: specialty.code,
        name: specialty.name,
        icon: specialty.icon,
      },
    };
  }

  static toSummary(entity: ServiceEntity): ServiceSummaryDTO {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      default_duration_minutes: entity.default_duration_minutes,
      default_price_cents: entity.default_price_cents,
    };
  }

  static toDTOList(entities: ServiceEntity[]): ServiceDTO[] {
    return entities.map((e) => this.toDTO(e));
  }

  static toSummaryList(entities: ServiceEntity[]): ServiceSummaryDTO[] {
    return entities.map((e) => this.toSummary(e));
  }
}
