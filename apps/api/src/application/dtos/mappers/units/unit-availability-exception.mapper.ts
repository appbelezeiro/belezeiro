import { UnitAvailabilityExceptionEntity } from '@/domain/entities/units/unit-availability-exception.entity';
import {
  UnitAvailabilityExceptionDTO,
  UnitAvailabilityExceptionListItemDTO,
} from '../../units/unit-availability-exception.dto';

export class UnitAvailabilityExceptionMapper {
  static toDTO(entity: UnitAvailabilityExceptionEntity): UnitAvailabilityExceptionDTO {
    return {
      id: entity.id,
      unit_id: entity.unit_id,
      date: entity.date,
      type: entity.type,
      start_time: entity.start_time,
      end_time: entity.end_time,
      slot_duration_minutes: entity.slot_duration_minutes,
      reason: entity.reason,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toListItem(
    entity: UnitAvailabilityExceptionEntity
  ): UnitAvailabilityExceptionListItemDTO {
    return {
      id: entity.id,
      date: entity.date,
      type: entity.type,
      start_time: entity.start_time,
      end_time: entity.end_time,
      reason: entity.reason,
    };
  }

  static toDTOList(
    entities: UnitAvailabilityExceptionEntity[]
  ): UnitAvailabilityExceptionDTO[] {
    return entities.map(this.toDTO);
  }

  static toListItemList(
    entities: UnitAvailabilityExceptionEntity[]
  ): UnitAvailabilityExceptionListItemDTO[] {
    return entities.map(this.toListItem);
  }
}
