import { UserEntity } from '@/domain/entities/users/user.entity';

export interface UserPersistence {
  id: string;
  name: string;
  email: string;
  providerId: string;
  photoUrl?: string;
  onboardingCompleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export class UserDataMapper {
  static toDomain(raw: UserPersistence): UserEntity {
    return new UserEntity({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      providerId: raw.providerId,
      photoUrl: raw.photoUrl,
      onboardingCompleted: raw.onboardingCompleted,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: UserEntity): UserPersistence {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      providerId: entity.providerId,
      photoUrl: entity.photoUrl,
      onboardingCompleted: entity.onboardingCompleted,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
