// ============================================================================
// ONBOARDING SCHEMAS - Validação para formulários de onboarding
// ============================================================================

import { z } from 'zod';
import {
  requiredString,
  optionalString,
  phoneSchema,
  optionalPhoneSchema,
  cepSchema,
  hexColorSchema,
  errorMessages,
} from './common.schemas';

/**
 * Schema para Step 1: Informações Básicas
 */
export const basicInfoSchema = z.object({
  businessName: requiredString(2, 100),
  unitName: requiredString(2, 100),
  logo: z.string().nullable().optional(),
  gallery: z.array(z.string()).optional(),
  whatsapp: phoneSchema,
  phone: optionalPhoneSchema,
});

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

/**
 * Schema para Step 2: Endereço
 */
export const addressStepSchema = z.object({
  cep: cepSchema,
  street: requiredString(3, 200),
  number: requiredString(1, 20),
  complement: optionalString(100),
  neighborhood: requiredString(2, 100),
  city: requiredString(2, 100),
  state: z.string().length(2, 'UF inválido'),
});

export type AddressStepFormData = z.infer<typeof addressStepSchema>;

/**
 * Schema para Step 3: Especialidades
 */
export const specialtiesSchema = z.object({
  professions: z.array(z.string()).min(1, 'Selecione pelo menos uma profissão'),
  services: z.array(z.string()).min(1, 'Selecione pelo menos um serviço'),
});

export type SpecialtiesFormData = z.infer<typeof specialtiesSchema>;

/**
 * Schema para Step 4: Tipo de Atendimento
 */
export const serviceTypeSchema = z.object({
  serviceType: z.enum(['local', 'home', 'both'], {
    required_error: 'Selecione uma opção',
  }),
});

export type ServiceTypeFormData = z.infer<typeof serviceTypeSchema>;

/**
 * Schema para Step 7: Personalização
 */
export const personalizationSchema = z.object({
  brandColor: hexColorSchema,
});

export type PersonalizationFormData = z.infer<typeof personalizationSchema>;

/**
 * Mensagens de erro específicas para onboarding
 */
export const onboardingErrors = {
  businessName: 'Nome do negócio é obrigatório',
  unitName: 'Nome da unidade é obrigatório',
  whatsapp: 'WhatsApp é obrigatório',
  cep: 'CEP inválido',
  street: 'Rua é obrigatória',
  number: 'Número é obrigatório',
  neighborhood: 'Bairro é obrigatório',
  city: 'Cidade é obrigatória',
  state: 'Estado é obrigatório',
  professions: 'Selecione pelo menos uma profissão',
  services: 'Selecione pelo menos um serviço',
  serviceType: 'Selecione o tipo de atendimento',
  brandColor: 'Cor da marca inválida',
};
