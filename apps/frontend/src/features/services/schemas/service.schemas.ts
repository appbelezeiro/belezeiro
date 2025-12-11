// ============================================================================
// SERVICE SCHEMAS - Zod Validation Schemas for Services Feature
// ============================================================================

import { z } from "zod";

/**
 * Service Schema
 */
export const serviceSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  duration: z.number().positive("Duração deve ser maior que zero"),
  price: z.number().min(0, "Preço não pode ser negativo"),
  category: z.string(),
  color: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * Service Category Schema
 */
export const serviceCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  order: z.number(),
  servicesCount: z.number(),
});

/**
 * Service with Stats Schema
 */
export const serviceWithStatsSchema = serviceSchema.extend({
  appointmentsCount: z.number(),
  revenue: z.number(),
  averageRating: z.number().optional(),
});

/**
 * Create Service Request Schema
 */
export const createServiceRequestSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().optional(),
  duration: z.number().positive("Duração deve ser maior que zero"),
  price: z.number().min(0, "Preço não pode ser negativo"),
  category: z.string(),
  color: z.string().optional(),
});

/**
 * Update Service Request Schema
 */
export const updateServiceRequestSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  duration: z.number().positive().optional(),
  price: z.number().min(0).optional(),
  category: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
});

/**
 * Services List Response Schema
 */
export const servicesListResponseSchema = z.object({
  services: z.array(serviceWithStatsSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

// Type exports from schemas
export type ServiceInput = z.infer<typeof serviceSchema>;
export type ServiceCategoryInput = z.infer<typeof serviceCategorySchema>;
export type ServiceWithStatsInput = z.infer<typeof serviceWithStatsSchema>;
export type CreateServiceInput = z.infer<typeof createServiceRequestSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceRequestSchema>;
