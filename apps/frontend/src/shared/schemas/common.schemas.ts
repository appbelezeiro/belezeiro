// ============================================================================
// COMMON SCHEMAS - Validadores compartilhados para formulários
// ============================================================================

import { z } from 'zod';
import { extractDigits } from '@/lib/utils/phone';
import { extractCepDigits } from '@/services/api/cep.service';

// ============================================================================
// Mensagens de erro padrão
// ============================================================================

export const errorMessages = {
  required: 'Campo obrigatório',
  minLength: (min: number) => `Mínimo ${min} caracteres`,
  maxLength: (max: number) => `Máximo ${max} caracteres`,
  email: 'Email inválido',
  phone: 'Telefone inválido',
  cep: 'CEP inválido',
  url: 'URL inválida',
  hex: 'Cor inválida',
  min: (min: number) => `Mínimo ${min}`,
  max: (max: number) => `Máximo ${max}`,
  positive: 'Deve ser positivo',
  futureDate: 'Data não pode ser futura',
  invalidDate: 'Data inválida',
};

// ============================================================================
// Schemas Base
// ============================================================================

/**
 * Campo de texto obrigatório
 */
export const requiredString = (minLength = 1, maxLength = 255) =>
  z
    .string({ required_error: errorMessages.required })
    .min(minLength, minLength === 1 ? errorMessages.required : errorMessages.minLength(minLength))
    .max(maxLength, errorMessages.maxLength(maxLength));

/**
 * Campo de texto opcional
 */
export const optionalString = (maxLength = 255) =>
  z
    .string()
    .max(maxLength, errorMessages.maxLength(maxLength))
    .optional()
    .or(z.literal(''));

/**
 * Email obrigatório
 */
export const requiredEmail = z
  .string({ required_error: errorMessages.required })
  .min(1, errorMessages.required)
  .email(errorMessages.email);

/**
 * Email opcional
 */
export const optionalEmail = z
  .string()
  .email(errorMessages.email)
  .optional()
  .or(z.literal(''));

/**
 * Telefone brasileiro (10-11 dígitos)
 * Aceita formatado ou apenas dígitos
 */
export const phoneSchema = z
  .string({ required_error: errorMessages.required })
  .min(1, errorMessages.required)
  .refine(
    (val) => {
      const digits = extractDigits(val);
      return digits.length === 10 || digits.length === 11;
    },
    { message: errorMessages.phone }
  );

/**
 * Telefone opcional
 */
export const optionalPhoneSchema = z
  .string()
  .refine(
    (val) => {
      if (!val || val === '') return true;
      const digits = extractDigits(val);
      return digits.length === 10 || digits.length === 11;
    },
    { message: errorMessages.phone }
  )
  .optional()
  .or(z.literal(''));

/**
 * CEP brasileiro (8 dígitos)
 */
export const cepSchema = z
  .string({ required_error: errorMessages.required })
  .min(1, errorMessages.required)
  .refine(
    (val) => {
      const digits = extractCepDigits(val);
      return digits.length === 8;
    },
    { message: errorMessages.cep }
  );

/**
 * URL opcional
 */
export const optionalUrl = z
  .string()
  .url(errorMessages.url)
  .optional()
  .or(z.literal(''));

/**
 * URL obrigatória
 */
export const requiredUrl = z
  .string({ required_error: errorMessages.required })
  .min(1, errorMessages.required)
  .url(errorMessages.url);

/**
 * Cor hexadecimal
 */
export const hexColorSchema = z
  .string({ required_error: errorMessages.required })
  .min(1, errorMessages.required)
  .regex(/^#[0-9A-Fa-f]{6}$/, errorMessages.hex);

/**
 * Número positivo obrigatório
 */
export const positiveNumber = z
  .number({ required_error: errorMessages.required })
  .positive(errorMessages.positive);

/**
 * Número com mínimo
 */
export const minNumber = (min: number) =>
  z
    .number({ required_error: errorMessages.required })
    .min(min, errorMessages.min(min));

/**
 * Data não futura (para data de nascimento)
 */
export const pastDateSchema = z
  .string()
  .refine(
    (val) => {
      if (!val) return true;
      const date = new Date(val);
      return date <= new Date();
    },
    { message: errorMessages.futureDate }
  )
  .optional()
  .or(z.literal(''));

/**
 * OTP de 6 dígitos
 */
export const otpSchema = z
  .string({ required_error: errorMessages.required })
  .length(6, 'Código deve ter 6 dígitos')
  .regex(/^\d{6}$/, 'Apenas números');

/**
 * Estado brasileiro (UF)
 */
export const ufSchema = z
  .string({ required_error: errorMessages.required })
  .length(2, 'UF inválido')
  .toUpperCase();

// ============================================================================
// Schemas Compostos
// ============================================================================

/**
 * Schema de endereço completo
 */
export const addressSchema = z.object({
  cep: cepSchema,
  street: requiredString(3, 200),
  number: requiredString(1, 20),
  complement: optionalString(100),
  neighborhood: requiredString(2, 100),
  city: requiredString(2, 100),
  state: ufSchema,
});

export type AddressFormData = z.infer<typeof addressSchema>;

/**
 * Schema de horário de funcionamento
 */
export const workingHourSchema = z.object({
  enabled: z.boolean(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  hasLunchBreak: z.boolean().optional(),
  lunchStart: z.string().optional(),
  lunchEnd: z.string().optional(),
});

export type WorkingHourFormData = z.infer<typeof workingHourSchema>;
