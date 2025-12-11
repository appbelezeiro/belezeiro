// ============================================================================
// AUTH MAPPERS - Data Transformation Layer
// ============================================================================

import type { GoogleUserInfo, LoginRequest, User } from "@/types/auth.types";
import { validateData, googleUserInfoSchema, userSchema } from "@/schemas/auth.schemas";

/**
 * Maps Google OAuth user info to our LoginRequest format
 * Validates and transforms the data for API consumption
 */
export function mapGoogleUserToLoginRequest(googleUser: GoogleUserInfo): LoginRequest {
  // Validate Google user data
  const validatedUser = validateData(googleUserInfoSchema, googleUser);

  return {
    name: validatedUser.name,
    email: validatedUser.email,
    providerId: `google_${validatedUser.sub}`,
    photoUrl: validatedUser.picture,
  };
}

/**
 * Maps API user response to our User type
 * Validates the data coming from the API
 */
export function mapApiUserToUser(apiUser: unknown): User {
  return validateData(userSchema, apiUser);
}

/**
 * Maps user data for display purposes
 * Adds computed properties and formatting
 */
export function mapUserForDisplay(user: User) {
  return {
    ...user,
    displayName: user.name,
    avatarUrl: user.photo || getDefaultAvatar(user.email),
    initials: getInitials(user.name),
    isVerified: user.isActive,
  };
}

/**
 * Get user initials from name
 * @example "João Silva" → "JS"
 */
function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generate default avatar URL based on email
 * Using UI Avatars service
 */
function getDefaultAvatar(email: string): string {
  const name = email.split("@")[0];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=200`;
}

/**
 * Sanitize user data for storage
 * Removes sensitive information before caching
 */
export function sanitizeUserForStorage(user: User): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo,
    isActive: user.isActive,
  };
}
