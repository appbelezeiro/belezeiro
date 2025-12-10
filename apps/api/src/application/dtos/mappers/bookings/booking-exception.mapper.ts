import { BookingExceptionEntity } from '@/domain/entities/bookings/booking-exception.entity';
import { BookingExceptionDTO, BookingExceptionListItemDTO } from '../../bookings/booking-exception.dto';

export class BookingExceptionMapper {
  static toDTO(entity: BookingExceptionEntity): BookingExceptionDTO {
    return {
      id: entity.id,
      user_id: entity.user_id,
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

  static toListItem(entity: BookingExceptionEntity): BookingExceptionListItemDTO {
    return {
      id: entity.id,
      date: entity.date,
      type: entity.type,
      start_time: entity.start_time,
      end_time: entity.end_time,
      reason: entity.reason,
    };
  }

  static toDTOList(entities: BookingExceptionEntity[]): BookingExceptionDTO[] {
    return entities.map(this.toDTO);
  }

  static toListItemList(entities: BookingExceptionEntity[]): BookingExceptionListItemDTO[] {
    return entities.map(this.toListItem);
  }
}
