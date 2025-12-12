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

const especialidadeRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
});

const serviceRefSchema = z.object({
  id: z.string(),
  name: z.string(),
  especialidadeId: z.string(),
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
  ownerId: z.string().min(1),
});

export const organizationDTOSchema = z.object({
  id: z.string(),
  businessName: z.string(),
  ownerId: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// ============================================================================
// Unit Schemas
// ============================================================================

export const createUnitRequestSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(1, 'Nome da unidade é obrigatório'),
  brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor inválida'),
  subscription: z
    .object({
      plan: z.enum(['free', 'pro', 'enterprise']),
      status: z.enum(['active', 'inactive', 'suspended']),
      expiresAt: z.string().optional(),
    })
    .optional(),
  logo: z.string().url().optional(),
  gallery: z.array(z.string().url()).optional(),
  whatsapp: z.string().min(10, 'WhatsApp deve ter pelo menos 10 dígitos'),
  phone: z.string().min(10).optional(),
  address: addressSchema,
  especialidades: z.array(especialidadeRefSchema).min(1, 'Selecione pelo menos uma especialidade'),
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
  brandColor: z.string(),
  subscription: z
    .object({
      plan: z.enum(['free', 'pro', 'enterprise']),
      status: z.enum(['active', 'inactive', 'suspended']),
      expiresAt: z.string().optional(),
    })
    .optional(),
  logo: z.string().optional(),
  gallery: z.array(z.string()),
  isActive: z.boolean(),
  whatsapp: z.string(),
  phone: z.string().optional(),
  address: addressSchema,
  especialidades: z.array(especialidadeRefSchema),
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

  // Unit
  unitName: z.string().min(1, 'Nome da unidade é obrigatório'),
  brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor inválida'),
  logo: z.string().optional(),
  gallery: z.array(z.string()),
  whatsapp: z.string().min(10, 'WhatsApp deve ter pelo menos 10 dígitos'),
  phone: z.string().optional(),
  address: addressSchema,
  especialidades: z.array(especialidadeRefSchema).min(1, 'Selecione pelo menos uma especialidade'),
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
