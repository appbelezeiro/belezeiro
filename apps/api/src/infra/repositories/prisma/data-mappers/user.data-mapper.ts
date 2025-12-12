import { User as PrismaUser } from '@prisma/client';
import { UserEntity } from '@/domain/entities/users/user.entity.js';

export class UserDataMapper {
  static toDomain(raw: PrismaUser): UserEntity {
    return new UserEntity({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      providerId: raw.provider_id,
      photoUrl: raw.photo_url ?? undefined,
      onboardingCompleted: raw.onboarding_completed,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: UserEntity): Omit<PrismaUser, 'created_at' | 'updated_at'> {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      provider_id: entity.providerId,
      photo_url: entity.photoUrl ?? null,
      onboarding_completed: entity.onboardingCompleted,
    };
  }

  static toPrismaCreate(entity: UserEntity): Omit<PrismaUser, 'updated_at'> {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      provider_id: entity.providerId,
      photo_url: entity.photoUrl ?? null,
      onboarding_completed: entity.onboardingCompleted,
      created_at: entity.created_at,
    };
  }
}
