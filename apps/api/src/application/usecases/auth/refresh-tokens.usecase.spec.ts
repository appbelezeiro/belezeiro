import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { RefreshTokensUseCase } from './refresh-tokens.usecase';
import { ITokenService, TokenPayload, TokenPair } from '@/application/contracts/services/i-token-service.interface';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

// Mock implementation of ITokenService
class MockTokenService implements ITokenService {
  async generate_session_token(payload: TokenPayload): Promise<string> {
    return `session_${payload.sub}`;
  }

  async generate_refresh_token(payload: TokenPayload): Promise<string> {
    return `refresh_${payload.sub}`;
  }

  async generate_token_pair(payload: TokenPayload): Promise<TokenPair> {
    return {
      session_token: await this.generate_session_token(payload),
      refresh_token: await this.generate_refresh_token(payload),
    };
  }

  async verify_session_token(token: string): Promise<TokenPayload> {
    return {
      sub: 'user_123',
      email: 'test@example.com',
      name: 'Test User',
    };
  }

  async verify_refresh_token(token: string): Promise<TokenPayload> {
    if (token === 'invalid_token') {
      throw new Error('Invalid refresh token');
    }
    return {
      sub: 'user_123',
      email: 'test@example.com',
      name: 'Test User',
    };
  }
}

describe('RefreshTokensUseCase', () => {
  let sut: RefreshTokensUseCase;
  let token_service: MockTokenService;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    token_service = new MockTokenService();
    sut = new RefreshTokensUseCase(token_service);
  });

  it('should refresh tokens with valid refresh token', async () => {
    const input = {
      refresh_token: 'valid_refresh_token',
    };

    const result = await sut.execute(input);

    expect(result).toHaveProperty('session_token');
    expect(result).toHaveProperty('refresh_token');
    expect(result.session_token).toBe('session_user_123');
    expect(result.refresh_token).toBe('refresh_user_123');
  });

  it('should verify refresh token before generating new tokens', async () => {
    const verify_spy = vi.spyOn(token_service, 'verify_refresh_token');
    const generate_spy = vi.spyOn(token_service, 'generate_token_pair');

    const input = {
      refresh_token: 'valid_refresh_token',
    };

    await sut.execute(input);

    expect(verify_spy).toHaveBeenCalledWith('valid_refresh_token');
    expect(generate_spy).toHaveBeenCalledWith({
      sub: 'user_123',
      email: 'test@example.com',
      name: 'Test User',
    });
  });

  it('should throw error when refresh token is invalid', async () => {
    const input = {
      refresh_token: 'invalid_token',
    };

    await expect(sut.execute(input)).rejects.toThrow('Invalid refresh token');
  });

  it('should return new token pair with same user payload', async () => {
    const input = {
      refresh_token: 'valid_refresh_token',
    };

    const result = await sut.execute(input);

    expect(result.session_token).toContain('user_123');
    expect(result.refresh_token).toContain('user_123');
  });
});
