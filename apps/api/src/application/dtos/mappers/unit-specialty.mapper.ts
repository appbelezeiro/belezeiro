import { UnitSpecialtyEntity } from '@/domain/entities/unit-specialty.entity';
import { SpecialtyEntity } from '@/domain/entities/specialty.entity';
import { UnitSpecialtyDTO, UnitSpecialtyWithDetailsDTO } from '../unit-specialty.dto';

export class UnitSpecialtyMapper {
  static toDTO(entity: UnitSpecialtyEntity): UnitSpecialtyDTO {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      specialty_id: entity.specialty_id,
      created_at: entity.created_at,
    };
  }

  static toWithDetails(
    entity: UnitSpecialtyEntity,
    specialty: SpecialtyEntity
  ): UnitSpecialtyWithDetailsDTO {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      specialty: {
        id: specialty.id,
        code: specialty.code,
        name: specialty.name,
        icon: specialty.icon,
        description: specialty.description,
      },
      created_at: entity.created_at,
    };
  }

  static toDTOList(entities: UnitSpecialtyEntity[]): UnitSpecialtyDTO[] {
    return entities.map((e) => this.toDTO(e));
  }
}
