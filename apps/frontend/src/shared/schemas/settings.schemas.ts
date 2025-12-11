// ============================================================================
// SETTINGS SCHEMAS - Validação para formulários de configurações
// ============================================================================

import { z } from 'zod';
import {
  requiredString,
  optionalString,
  phoneSchema,
  optionalPhoneSchema,
  optionalUrl,
  cepSchema,
} from './common.schemas';

/**
 * Schema para BusinessSettings - Negócio
 */
export const businessNameSchema = z.object({
  businessName: requiredString(2, 100),
});

export type BusinessNameFormData = z.infer<typeof businessNameSchema>;

/**
 * Schema para BusinessSettings - Unidade (info básica)
 */
export const unitBasicInfoSchema = z.object({
  unitName: requiredString(2, 100),
});

export type UnitBasicInfoFormData = z.infer<typeof unitBasicInfoSchema>;

/**
 * Schema para BusinessSettings - Contato
 */
export const contactInfoSchema = z.object({
  whatsapp: phoneSchema,
  phone: optionalPhoneSchema,
});

export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;

/**
 * Schema para BusinessSettings - Endereço
 */
export const addressInfoSchema = z.object({
  cep: cepSchema,
  street: requiredString(3, 200),
  number: requiredString(1, 20),
  complement: optionalString(100),
  neighborhood: requiredString(2, 100),
  city: requiredString(2, 100),
  state: z.string().length(2, 'UF inválido'),
});

export type AddressInfoFormData = z.infer<typeof addressInfoSchema>;

/**
 * Schema para PersonalProfileSettings
 */
export const personalProfileSchema = z.object({
  name: requiredString(2, 100),
  phone: optionalPhoneSchema,
});

export type PersonalProfileFormData = z.infer<typeof personalProfileSchema>;

/**
 * Schema para PublicSiteSettings
 */
export const publicSiteSchema = z.object({
  siteTitle: optionalString(100),
  siteHeadline: optionalString(200),
  aboutUs: optionalString(1000),
  instagram: optionalUrl,
  facebook: optionalUrl,
  whatsappLink: optionalUrl,
  externalSite: optionalUrl,
});

export type PublicSiteFormData = z.infer<typeof publicSiteSchema>;
