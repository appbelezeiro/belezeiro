import { UserEntity } from '@/domain/entities/users/user.entity';
import { UserDTO, UserProfileDTO } from '../../users/user.dto';

export class UserMapper {
  static toDTO(entity: UserEntity): UserDTO {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      photoUrl: entity.photoUrl,
      created_at: entity.created_at,
    };
  }

  static toProfile(entity: UserEntity): UserProfileDTO {
    return {
      email: entity.email,
      name: entity.name,
      photoUrl: entity.photoUrl,
    };
  }

  static toDTOList(entities: UserEntity[]): UserDTO[] {
    return entities.map(this.toDTO);
  }
}
