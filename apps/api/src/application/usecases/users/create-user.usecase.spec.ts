import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreateUserUseCase } from './create-user.usecase';
import { InMemoryUserRepository } from '@/infra/repositories/in-memory/users/in-memory-user.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('CreateUserUseCase', () => {
  let sut: CreateUserUseCase;
  let user_repository: InMemoryUserRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    user_repository = new InMemoryUserRepository();
    sut = new CreateUserUseCase(user_repository);
  });

  it('should create a new user', async () => {
    const input = {
      name: 'John Doe',
      email: 'john@example.com',
      providerId: 'test-provider-id',
      photoUrl: 'https://example.com/photo.jpg',
    };

    const user = await sut.execute(input);

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.providerId).toBe('test-provider-id');
    expect(user.photoUrl).toBe('https://example.com/photo.jpg');
    expect(user.id).toContain('usr_');
  });
});
