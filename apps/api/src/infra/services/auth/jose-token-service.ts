import * as jose from 'jose';
import {
  ITokenService,
  TokenPayload,
  TokenPair,
} from '@/application/contracts/services/i-token-service.interface';

export class JoseTokenService implements ITokenService {
  private readonly secret: Uint8Array;
  private readonly session_expiration = '15m';
  private readonly refresh_expiration = '7d';

  constructor(secret?: string) {
    const secret_key = secret || process.env.JWT_SECRET || 'default-secret-key-change-in-production';
    this.secret = new TextEncoder().encode(secret_key);
  }

  async generate_session_token(payload: TokenPayload): Promise<string> {
    return await new jose.SignJWT({
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.session_expiration)
      .sign(this.secret);
  }

  async generate_refresh_token(payload: TokenPayload): Promise<string> {
    return await new jose.SignJWT({
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.refresh_expiration)
      .sign(this.secret);
  }

  async generate_token_pair(payload: TokenPayload): Promise<TokenPair> {
    const [session_token, refresh_token] = await Promise.all([
      this.generate_session_token(payload),
      this.generate_refresh_token(payload),
    ]);

    return {
      session_token,
      refresh_token,
    };
  }

  async verify_session_token(token: string): Promise<TokenPayload> {
    try {
      const { payload } = await jose.jwtVerify(token, this.secret);

      return {
        sub: payload.sub as string,
        email: payload.email as string,
        name: payload.name as string,
      };
    } catch (error) {
      throw new Error('Invalid or expired session token');
    }
  }

  async verify_refresh_token(token: string): Promise<TokenPayload> {
    try {
      const { payload } = await jose.jwtVerify(token, this.secret);

      return {
        sub: payload.sub as string,
        email: payload.email as string,
        name: payload.name as string,
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }
}
