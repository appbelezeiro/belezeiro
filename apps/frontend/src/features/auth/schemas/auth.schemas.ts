// ============================================================================
// AUTH SCHEMAS - Schemas Zod para validação
// ============================================================================

import { z } from 'zod';

/**
 * Schema do usuário
 */
export const userSchema = z.object({
  id: z.string().min(1, 'ID do usuário é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  photo: z.string().url('URL da foto inválida').optional(),
  isActive: z.boolean().optional().default(true),
  onboardingCompleted: z.boolean(),
});

/**
 * Schema de requisição de login
 */
export const loginRequestSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  providerId: z.string().min(1, 'Provider ID é obrigatório'),
  photoUrl: z.string().url('URL da foto inválida').optional(),
});

/**
 * Schema de resposta de login
 * Backend retorna apenas { onboarding: false } quando onboarding não foi feito,
 * e não retorna nada quando já foi completado
 */
export const loginResponseSchema = z.object({
  /** Only present when onboarding is NOT completed (false means onboarding required) */
  onboarding: z.boolean().optional(),
});

/**
 * Schema de resposta do endpoint /me
 */
export const meResponseSchema = z.object({
  user: userSchema,
  /** Only present when onboarding is not completed (false means onboarding required) */
  onboarding: z.boolean().optional(),
});

/**
 * Schema de resposta de refresh token
 */
export const refreshTokenResponseSchema = z.object({
  status: z.string(),
});

/**
 * Schema de resposta de logout
 */
export const logoutResponseSchema = z.object({
  status: z.string(),
});

/**
 * Schema de informações do Google OAuth
 */
export const googleUserInfoSchema = z.object({
  sub: z.string().min(1, 'ID do Google é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  email_verified: z.boolean(),
  picture: z.string().url('URL da foto inválida').optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  locale: z.string().optional(),
});

// ============================================================================
// Type Inferences
// ============================================================================

export type UserSchema = z.infer<typeof userSchema>;
export type LoginRequestSchema = z.infer<typeof loginRequestSchema>;
export type LoginResponseSchema = z.infer<typeof loginResponseSchema>;
export type MeResponseSchema = z.infer<typeof meResponseSchema>;
export type GoogleUserInfoSchema = z.infer<typeof googleUserInfoSchema>;
