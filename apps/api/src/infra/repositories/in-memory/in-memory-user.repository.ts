import { UserEntity } from '@/domain/entities/user.entity';
import { IUserRepository } from '@/application/contracts/i-user-repository.interface';
import { UserDataMapper, UserPersistence } from './data-mappers/user.data-mapper';

export class InMemoryUserRepository implements IUserRepository {
  private users: UserPersistence[] = [];

  async create(user: UserEntity): Promise<UserEntity> {
    const persistence = UserDataMapper.toPersistence(user);
    this.users.push(persistence);
    return UserDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<UserEntity | null> {
    const user = this.users.find((u) => u.id === id);
    return user ? UserDataMapper.toDomain(user) : null;
  }

  async find_by_email(email: string): Promise<UserEntity | null> {
    const user = this.users.find((u) => u.email === email);
    return user ? UserDataMapper.toDomain(user) : null;
  }

  async list_all(): Promise<UserEntity[]> {
    return this.users.map(UserDataMapper.toDomain);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index === -1) {
      throw new Error(`User with id ${user.id} not found`);
    }

    const persistence = UserDataMapper.toPersistence(user);
    this.users[index] = persistence;
    return UserDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }
}
