import { UserEntity } from '@/domain/entities/users/user.entity';
import { UserDTO, UserProfileDTO, UserAuthDTO } from '../../users/user.dto';

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

  /**
   * Returns user data formatted for auth responses (login, /me endpoint)
   * This format matches the frontend User type expectations
   */
  static toAuth(entity: UserEntity): UserAuthDTO {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      photo: entity.photoUrl,
      isActive: true, // Users that exist are considered active
      onboardingCompleted: entity.onboardingCompleted,
    };
  }

  static toDTOList(entities: UserEntity[]): UserDTO[] {
    return entities.map(this.toDTO);
  }
}
