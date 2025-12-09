import { UserEntity } from '@/domain/entities/user.entity';

export interface IUserRepository {
  create(user: UserEntity): Promise<UserEntity>;
  find_by_id(id: string): Promise<UserEntity | null>;
  find_by_email(email: string): Promise<UserEntity | null>;
  find_by_provider_id(providerId: string): Promise<UserEntity | null>;
  list_all(): Promise<UserEntity[]>;
  update(user: UserEntity): Promise<UserEntity>;
  delete(id: string): Promise<boolean>;
}
