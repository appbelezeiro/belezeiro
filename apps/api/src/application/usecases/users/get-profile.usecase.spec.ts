import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GetProfileUseCase } from './get-profile.usecase';
import { InMemoryUserRepository } from '@/infra/repositories/in-memory/users/in-memory-user.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { UserEntity } from '@/domain/entities/users/user.entity';
import { UserNotFoundError } from '@/domain/errors/users/user-not-found.error';

describe('GetProfileUseCase', () => {
  let sut: GetProfileUseCase;
  let user_repository: InMemoryUserRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    user_repository = new InMemoryUserRepository();
    sut = new GetProfileUseCase(user_repository);
  });

  it('should return user profile when user exists', async () => {
    const user = new UserEntity({
      name: 'Leonardo Oliveira',
      email: 'c.p.leonardooliveira@gmail.com',
      providerId: '103410879415972377342',
      photoUrl: 'https://lh3.googleusercontent.com/a/photo.jpg',
    });

    const created_user = await user_repository.create(user);

    const result = await sut.execute({ user_id: created_user.id });

    expect(result.id).toBe(created_user.id);
    expect(result.name).toBe('Leonardo Oliveira');
    expect(result.email).toBe('c.p.leonardooliveira@gmail.com');
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    await expect(sut.execute({ user_id: 'non-existent-id' })).rejects.toThrow(UserNotFoundError);
  });
});
