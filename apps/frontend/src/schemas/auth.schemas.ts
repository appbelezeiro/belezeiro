// ============================================================================
// AUTH SCHEMAS - Zod Validation Schemas
// ============================================================================

import { z } from "zod";

/**
 * User schema - matches API response
 */
export const userSchema = z.object({
  id: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  photo: z.string().url("Invalid photo URL").optional(),
  isActive: z.boolean().optional().default(true),
});

/**
 * Login request schema - validates data before sending to API
 */
export const loginRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  providerId: z.string().min(1, "Provider ID is required"),
  photoUrl: z.string().url("Invalid photo URL").optional(),
});

/**
 * Login response schema
 */
export const loginResponseSchema = z.object({
  user: userSchema,
});

/**
 * Refresh token response schema
 */
export const refreshTokenResponseSchema = z.object({
  status: z.string(),
});

/**
 * Logout response schema
 */
export const logoutResponseSchema = z.object({
  status: z.string(),
});

/**
 * Me response schema
 */
export const meResponseSchema = z.object({
  user: userSchema,
});

/**
 * Google user info schema
 */
export const googleUserInfoSchema = z.object({
  sub: z.string().min(1, "Google user ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  email_verified: z.boolean(),
  picture: z.string().url("Invalid picture URL").optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  locale: z.string().optional(),
});

/**
 * API error schema
 */
export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    type: z.string(),
    message: z.string(),
    code: z.string().optional(),
    timestamp: z.string(),
    issues: z
      .array(
        z.object({
          path: z.array(z.string()),
          message: z.string(),
        })
      )
      .optional(),
  }),
});

/**
 * Validate and parse data with Zod schema
 * Throws error if validation fails
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safely validate data without throwing
 * Returns success/error result
 */
export function safeValidateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
