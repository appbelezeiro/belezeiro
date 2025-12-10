import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { AuthenticateWithProviderUseCase } from './authenticate-with-provider.usecase';
import { InMemoryUserRepository } from '@/infra/repositories/in-memory/users/in-memory-user.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';
import { UserEntity } from '@/domain/entities/users/user.entity';
import { EmailAlreadyExistsError } from '@/domain/errors/users/email-already-exists.error';

describe('AuthenticateWithProviderUseCase', () => {
  let sut: AuthenticateWithProviderUseCase;
  let user_repository: InMemoryUserRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    user_repository = new InMemoryUserRepository();
    sut = new AuthenticateWithProviderUseCase(user_repository);
  });

  it('should create a new user when providerId does not exist', async () => {
    const input = {
      name: 'Leonardo Oliveira',
      email: 'c.p.leonardooliveira@gmail.com',
      providerId: '103410879415972377342',
      photoUrl: 'https://lh3.googleusercontent.com/a/photo.jpg',
    };

    const result = await sut.execute(input);

    expect(result.is_new_user).toBe(true);
    expect(result.user.name).toBe(input.name);
    expect(result.user.email).toBe(input.email);
    expect(result.user.providerId).toBe(input.providerId);
    expect(result.user.photoUrl).toBe(input.photoUrl);
  });

  it('should return existing user when providerId already exists', async () => {
    const existing_user = new UserEntity({
      name: 'Leonardo Oliveira',
      email: 'c.p.leonardooliveira@gmail.com',
      providerId: '103410879415972377342',
      photoUrl: 'https://lh3.googleusercontent.com/a/photo.jpg',
    });

    await user_repository.create(existing_user);

    const input = {
      name: 'Leonardo Oliveira',
      email: 'c.p.leonardooliveira@gmail.com',
      providerId: '103410879415972377342',
      photoUrl: 'https://lh3.googleusercontent.com/a/photo.jpg',
    };

    const result = await sut.execute(input);

    expect(result.is_new_user).toBe(false);
    expect(result.user.id).toBe(existing_user.id);
  });

  it('should throw EmailAlreadyExistsError when email exists but providerId is different', async () => {
    const existing_user = new UserEntity({
      name: 'Leonardo Oliveira',
      email: 'c.p.leonardooliveira@gmail.com',
      providerId: 'different-provider-id',
      photoUrl: 'https://lh3.googleusercontent.com/a/photo.jpg',
    });

    await user_repository.create(existing_user);

    const input = {
      name: 'Leonardo Oliveira',
      email: 'c.p.leonardooliveira@gmail.com',
      providerId: '103410879415972377342',
      photoUrl: 'https://lh3.googleusercontent.com/a/photo.jpg',
    };

    await expect(sut.execute(input)).rejects.toThrow(EmailAlreadyExistsError);
  });

  it('should create user without photoUrl', async () => {
    const input = {
      name: 'Leonardo Oliveira',
      email: 'c.p.leonardooliveira@gmail.com',
      providerId: '103410879415972377342',
    };

    const result = await sut.execute(input);

    expect(result.is_new_user).toBe(true);
    expect(result.user.photoUrl).toBeUndefined();
  });
});
