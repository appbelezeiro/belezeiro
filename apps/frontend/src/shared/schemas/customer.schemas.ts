// ============================================================================
// CUSTOMER SCHEMAS - Validação para formulários de clientes
// ============================================================================

import { z } from 'zod';
import {
  requiredString,
  optionalString,
  phoneSchema,
  optionalEmail,
  pastDateSchema,
} from './common.schemas';

/**
 * Schema para adicionar cliente
 */
export const addCustomerSchema = z.object({
  name: requiredString(2, 100),
  phone: phoneSchema,
  email: optionalEmail,
});

export type AddCustomerFormData = z.infer<typeof addCustomerSchema>;

/**
 * Schema completo de cliente (com campos opcionais)
 */
export const customerFormSchema = z.object({
  name: requiredString(2, 100),
  phone: phoneSchema,
  email: optionalEmail,
  birthDate: pastDateSchema,
  notes: optionalString(500),
  tags: z.array(z.string()).optional(),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
