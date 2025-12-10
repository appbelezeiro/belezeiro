import { BookingRuleEntity } from '@/domain/entities/bookings/booking-rule.entity';
import { BookingRuleDTO, BookingRuleListItemDTO } from '../../bookings/booking-rule.dto';

export class BookingRuleMapper {
  static toDTO(entity: BookingRuleEntity): BookingRuleDTO {
    return {
      id: entity.id,
      user_id: entity.user_id,
      type: entity.type,
      weekday: entity.weekday,
      date: entity.date,
      start_time: entity.start_time,
      end_time: entity.end_time,
      slot_duration_minutes: entity.slot_duration_minutes,
      min_advance_minutes: entity.min_advance_minutes,
      max_duration_minutes: entity.max_duration_minutes,
      max_bookings_per_day: entity.max_bookings_per_day,
      max_bookings_per_client_per_day: entity.max_bookings_per_client_per_day,
      metadata: entity.metadata,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toListItem(entity: BookingRuleEntity): BookingRuleListItemDTO {
    return {
      id: entity.id,
      type: entity.type,
      weekday: entity.weekday,
      date: entity.date,
      start_time: entity.start_time,
      end_time: entity.end_time,
      slot_duration_minutes: entity.slot_duration_minutes,
      min_advance_minutes: entity.min_advance_minutes,
      max_duration_minutes: entity.max_duration_minutes,
      max_bookings_per_day: entity.max_bookings_per_day,
      max_bookings_per_client_per_day: entity.max_bookings_per_client_per_day,
    };
  }

  static toDTOList(entities: BookingRuleEntity[]): BookingRuleDTO[] {
    return entities.map(this.toDTO);
  }

  static toListItemList(entities: BookingRuleEntity[]): BookingRuleListItemDTO[] {
    return entities.map(this.toListItem);
  }
}
