// ============================================================================
// CONTACT SCHEMAS - Validação para formulários de contato/suporte
// ============================================================================

import { z } from 'zod';
import {
  requiredString,
  requiredEmail,
  optionalPhoneSchema,
} from './common.schemas';

/**
 * Schema para formulário de contato
 */
export const contactFormSchema = z.object({
  name: requiredString(2, 100),
  email: requiredEmail,
  phone: optionalPhoneSchema,
  subject: requiredString(5, 100),
  message: requiredString(10, 1000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Schema para formulário de suporte/ticket
 */
export const supportTicketSchema = z.object({
  title: requiredString(5, 100),
  description: requiredString(20, 2000),
  type: z.enum(['bug', 'help', 'feature'], {
    required_error: 'Selecione o tipo do ticket',
  }),
});

export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;
