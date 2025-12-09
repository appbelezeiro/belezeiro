import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { ITokenService } from '@/application/contracts/services/i-token-service.interface';
import { UnauthorizedError } from '../errors/http-errors';

export type AuthContext = {
  userId: string;
  email: string;
  name: string;
};

export function createAuthMiddleware(token_service: ITokenService) {
  return async (c: Context, next: Next) => {
    const session_token = getCookie(c, 'session_token');

    if (!session_token) {
      throw new UnauthorizedError('Session token not found');
    }

    try {
      const payload = await token_service.verify_session_token(session_token);

      c.set('auth', {
        userId: payload.sub,
        email: payload.email,
        name: payload.name,
      } as AuthContext);

      await next();
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired session token');
    }
  };
}
