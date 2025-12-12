import { IUserRepository } from '@/application/contracts/users/i-user-repository.interface.js';
import { UserEntity } from '@/domain/entities/users/user.entity.js';
import { prisma } from '../client/index.js';
import { UserDataMapper } from '../data-mappers/index.js';

export class PrismaUserRepository implements IUserRepository {
  async create(user: UserEntity): Promise<UserEntity> {
    const data = UserDataMapper.toPrismaCreate(user);
    const created = await prisma.user.create({ data });
    return UserDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<UserEntity | null> {
    const found = await prisma.user.findUnique({ where: { id } });
    return found ? UserDataMapper.toDomain(found) : null;
  }

  async find_by_email(email: string): Promise<UserEntity | null> {
    const found = await prisma.user.findUnique({ where: { email } });
    return found ? UserDataMapper.toDomain(found) : null;
  }

  async find_by_provider_id(providerId: string): Promise<UserEntity | null> {
    const found = await prisma.user.findUnique({ where: { provider_id: providerId } });
    return found ? UserDataMapper.toDomain(found) : null;
  }

  async list_all(): Promise<UserEntity[]> {
    const users = await prisma.user.findMany({
      orderBy: { created_at: 'desc' },
    });
    return users.map(UserDataMapper.toDomain);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const data = UserDataMapper.toPrisma(user);
    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
    });
    return UserDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
