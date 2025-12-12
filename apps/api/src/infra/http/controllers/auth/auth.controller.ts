import { Context } from 'hono';
import { setCookie, deleteCookie, getCookie } from 'hono/cookie';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { EmailAlreadyExistsError } from '@/domain/errors/users/email-already-exists.error';
import { UserNotFoundError } from '@/domain/errors/users/user-not-found.error';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../errors/http-errors';
import { UserMapper } from '@/application/dtos/mappers/users/user.mapper';
import type { AuthContext } from '../../middleware/auth.middleware';

const SocialLoginSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  photoUrl: z.string().optional(),
  providerId: z.string().min(1),
});

export class AuthController {
  constructor(private readonly container: Container) { }

  async social_login(c: Context) {
    try {
      const body = await c.req.json();
      const payload = SocialLoginSchema.parse(body);

      const result = await this.container.use_cases.authenticate_with_provider.execute({
        name: payload.name,
        email: payload.email,
        providerId: payload.providerId,
        photoUrl: payload.photoUrl,
      });

      const token_pair = await this.container.services.token_service.generate_token_pair({
        sub: result.user.id,
        email: result.user.email,
        name: result.user.name,
      });

      setCookie(c, 'session_token', token_pair.session_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/',
        maxAge: 60 * 15,
      });

      setCookie(c, 'refresh_token', token_pair.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      const status = result.is_new_user ? 201 : 200;

      // Build response - only include onboarding: false when user hasn't completed it
      const response: { onboarding?: boolean; } = {};

      // Only return onboarding: false when user needs to complete onboarding
      if (!result.user.onboardingCompleted) {
        response.onboarding = false;
      }

      return c.json(response, status);
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        throw new ConflictError(error.message);
      }
      throw error;
    }
  }

  async refresh(c: Context) {
    const refresh_token = getCookie(c, 'refresh_token');

    if (!refresh_token) {
      throw new UnauthorizedError('Refresh token not found');
    }

    try {
      const token_pair = await this.container.use_cases.refresh_tokens.execute({
        refresh_token,
      });

      setCookie(c, 'session_token', token_pair.session_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/',
        maxAge: 60 * 15,
      });

      setCookie(c, 'refresh_token', token_pair.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return c.json(
        {
          status: 'Tokens refreshed successfully',
        },
        200,
      );
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  async logout(c: Context) {
    deleteCookie(c, 'session_token', {
      path: '/',
    });

    deleteCookie(c, 'refresh_token', {
      path: '/',
    });

    return c.json(
      {
        status: 'Logged out successfully',
      },
      200,
    );
  }

  async me(c: Context) {
    try {
      const auth = c.get('auth') as AuthContext;

      const user = await this.container.use_cases.get_profile.execute({
        user_id: auth.userId,
      });

      // Build response - only include onboarding: false when user hasn't completed it
      const response: {
        user: ReturnType<typeof UserMapper.toAuth>;
        onboarding?: boolean;
      } = {
        user: UserMapper.toAuth(user),
      };

      if (!user.onboardingCompleted) {
        response.onboarding = false;
      }

      return c.json(response, 200);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundError(error.message);
      }
      throw error;
    }
  }
}
