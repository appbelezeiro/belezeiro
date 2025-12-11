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
 */
export const loginResponseSchema = z.object({
  user: userSchema,
  created: z.boolean().optional(),
  pending_actions: z.record(z.string()).optional(),
});

/**
 * Schema de resposta do endpoint /me
 */
export const meResponseSchema = z.object({
  user: userSchema,
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
