// ============================================================================
// ONBOARDING API SCHEMAS - Validação para requests da API
// ============================================================================

import { z } from 'zod';

// ============================================================================
// Common Schemas
// ============================================================================

const dayScheduleSchema = z.object({
  enabled: z.boolean(),
  open: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM inválido'),
  close: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM inválido'),
});

const addressSchema = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
});

const professionRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
});

const serviceRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  professionId: z.string(),
});

const lunchBreakSchema = z.object({
  enabled: z.boolean(),
  start: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM inválido'),
  end: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Formato HH:MM inválido'),
});

const workingHoursSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
});

const amenityIdSchema = z.enum([
  'wifi',
  'parking',
  'coffee',
  'ac',
  'snacks',
  'waiting-room',
  'accessibility',
]);

// ============================================================================
// Organization Schemas
// ============================================================================

export const createOrganizationRequestSchema = z.object({
  businessName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor inválida'),
  ownerId: z.string().min(1),
  subscription: z
    .object({
      plan: z.enum(['free', 'pro', 'enterprise']),
      status: z.enum(['active', 'inactive', 'suspended']),
      expiresAt: z.string().optional(),
    })
    .optional(),
});

export const organizationDTOSchema = z.object({
  id: z.string(),
  businessName: z.string(),
  brandColor: z.string(),
  ownerId: z.string(),
  subscription: z
    .object({
      plan: z.enum(['free', 'pro', 'enterprise']),
      status: z.enum(['active', 'inactive', 'suspended']),
      expiresAt: z.string().optional(),
    })
    .optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ============================================================================
// Unit Schemas
// ============================================================================

export const createUnitRequestSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(1, 'Nome da unidade é obrigatório'),
  logo: z.string().url().optional(),
  gallery: z.array(z.string().url()).optional(),
  whatsapp: z.string().min(10, 'WhatsApp deve ter pelo menos 10 dígitos'),
  phone: z.string().min(10).optional(),
  address: addressSchema,
  professions: z.array(professionRefSchema).min(1, 'Selecione pelo menos uma profissão'),
  services: z.array(serviceRefSchema).min(1, 'Selecione pelo menos um serviço'),
  serviceType: z.enum(['local', 'home', 'both']),
  amenities: z.array(amenityIdSchema),
  workingHours: workingHoursSchema,
  lunchBreak: lunchBreakSchema.optional(),
});

export const unitDTOSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  name: z.string(),
  logo: z.string().optional(),
  gallery: z.array(z.string()),
  isActive: z.boolean(),
  whatsapp: z.string(),
  phone: z.string().optional(),
  address: addressSchema,
  professions: z.array(professionRefSchema),
  services: z.array(serviceRefSchema),
  serviceType: z.enum(['local', 'home', 'both']),
  amenities: z.array(amenityIdSchema),
  workingHours: workingHoursSchema,
  lunchBreak: lunchBreakSchema.optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ============================================================================
// Complete Onboarding Schema
// ============================================================================

export const onboardingSubmitDataSchema = z.object({
  // Organization
  businessName: z.string().min(2, 'Nome do negócio deve ter pelo menos 2 caracteres').max(100),
  brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor inválida'),

  // Unit
  unitName: z.string().min(1, 'Nome da unidade é obrigatório'),
  logo: z.string().optional(),
  gallery: z.array(z.string()),
  whatsapp: z.string().min(10, 'WhatsApp deve ter pelo menos 10 dígitos'),
  phone: z.string().optional(),
  address: addressSchema,
  professions: z.array(professionRefSchema).min(1, 'Selecione pelo menos uma profissão'),
  services: z.array(serviceRefSchema).min(1, 'Selecione pelo menos um serviço'),
  serviceType: z.enum(['local', 'home', 'both']),
  amenities: z.array(amenityIdSchema),
  workingHours: workingHoursSchema,
  lunchBreak: lunchBreakSchema.optional(),
});

// ============================================================================
// Type exports from schemas
// ============================================================================

export type CreateOrganizationRequestInput = z.infer<typeof createOrganizationRequestSchema>;
export type CreateUnitRequestInput = z.infer<typeof createUnitRequestSchema>;
export type OnboardingSubmitDataInput = z.infer<typeof onboardingSubmitDataSchema>;
