import { SpecialtyEntity } from '@/domain/entities/specialty.entity';
import { SpecialtyDTO, SpecialtySummaryDTO } from '../specialty.dto';

export class SpecialtyMapper {
  static toDTO(entity: SpecialtyEntity): SpecialtyDTO {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      icon: entity.icon,
      is_predefined: entity.is_predefined,
      is_active: entity.is_active,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toSummary(entity: SpecialtyEntity): SpecialtySummaryDTO {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      icon: entity.icon,
    };
  }

  static toDTOList(entities: SpecialtyEntity[]): SpecialtyDTO[] {
    return entities.map((e) => this.toDTO(e));
  }

  static toSummaryList(entities: SpecialtyEntity[]): SpecialtySummaryDTO[] {
    return entities.map((e) => this.toSummary(e));
  }
}
