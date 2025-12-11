import { UnitAvailabilityRuleEntity } from '@/domain/entities/units/unit-availability-rule.entity';
import {
  UnitAvailabilityRuleDTO,
  UnitAvailabilityRuleListItemDTO,
} from '../../units/unit-availability-rule.dto';

export class UnitAvailabilityRuleMapper {
  static toDTO(entity: UnitAvailabilityRuleEntity): UnitAvailabilityRuleDTO {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      type: entity.type,
      weekday: entity.weekday,
      date: entity.date,
      start_time: entity.start_time,
      end_time: entity.end_time,
      slot_duration_minutes: entity.slot_duration_minutes,
      is_active: entity.is_active,
      metadata: entity.metadata,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toListItem(
    entity: UnitAvailabilityRuleEntity
  ): UnitAvailabilityRuleListItemDTO {
    return {
      id: entity.id,
      type: entity.type,
      weekday: entity.weekday,
      date: entity.date,
      start_time: entity.start_time,
      end_time: entity.end_time,
      slot_duration_minutes: entity.slot_duration_minutes,
      is_active: entity.is_active,
    };
  }

  static toDTOList(entities: UnitAvailabilityRuleEntity[]): UnitAvailabilityRuleDTO[] {
    return entities.map(this.toDTO);
  }

  static toListItemList(
    entities: UnitAvailabilityRuleEntity[]
  ): UnitAvailabilityRuleListItemDTO[] {
    return entities.map(this.toListItem);
  }
}
