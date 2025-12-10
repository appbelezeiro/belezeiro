import { BookingEntity } from '@/domain/entities/booking.entity';
import { BookingDTO, BookingListItemDTO } from '../booking.dto';

export class BookingMapper {
  static toDTO(entity: BookingEntity): BookingDTO {
    return {
      id: entity.id,
      user_id: entity.user_id,
      client_id: entity.client_id,
      start_at: entity.start_at,
      end_at: entity.end_at,
      status: entity.status,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }

  static toListItem(entity: BookingEntity): BookingListItemDTO {
    return {
      id: entity.id,
      client_id: entity.client_id,
      start_at: entity.start_at,
      end_at: entity.end_at,
      status: entity.status,
    };
  }

  static toDTOList(entities: BookingEntity[]): BookingDTO[] {
    return entities.map(this.toDTO);
  }

  static toListItemList(entities: BookingEntity[]): BookingListItemDTO[] {
    return entities.map(this.toListItem);
  }
}
