import { Context, Next } from 'hono';
import { IUserRepository } from '@/application/contracts/users/i-user-repository.interface';
import { OnboardingRequiredError, UnauthorizedError } from '../errors/http-errors';
import type { AuthContext } from './auth.middleware';

/**
 * Middleware that verifies if the user has completed onboarding.
 * Should be used AFTER auth middleware to ensure user is authenticated.
 *
 * If user hasn't completed onboarding, returns 403 ONBOARDING_REQUIRED error.
 * Routes that are part of the onboarding flow should NOT use this middleware.
 */
export function createOnboardingMiddleware(user_repository: IUserRepository) {
  return async (c: Context, next: Next) => {
    const auth = c.get('auth') as AuthContext | undefined;

    if (!auth) {
      throw new UnauthorizedError('Authentication required');
    }

    const user = await user_repository.find_by_id(auth.userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    if (!user.onboardingCompleted) {
      throw new OnboardingRequiredError('Please complete onboarding to access this resource');
    }

    await next();
  };
}
