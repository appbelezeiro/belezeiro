// ============================================================================
// CUSTOMER SCHEMAS - Zod Validation Schemas for Customers Feature
// ============================================================================

import { z } from "zod";

/**
 * Customer Schema
 */
export const customerSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().min(10, "Telefone inválido"),
  photo: z.string().url().optional(),
  birthDate: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
  isActive: z.boolean(),
});

/**
 * Customer with Stats Schema
 */
export const customerWithStatsSchema = customerSchema.extend({
  totalAppointments: z.number(),
  totalSpent: z.number(),
  lastVisit: z.string().optional(),
  nextAppointment: z.string().optional(),
});

/**
 * Customer History Item Schema
 */
export const customerHistoryItemSchema = z.object({
  id: z.string(),
  type: z.enum(["appointment", "payment", "note"]),
  date: z.string(),
  description: z.string(),
  value: z.number().optional(),
  status: z.string().optional(),
});

/**
 * Create Customer Request Schema
 */
export const createCustomerRequestSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().min(10, "Telefone inválido"),
  birthDate: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Update Customer Request Schema
 */
export const updateCustomerRequestSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(10).optional(),
  birthDate: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Customers List Response Schema
 */
export const customersListResponseSchema = z.object({
  customers: z.array(customerWithStatsSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

/**
 * Customer Tag Schema
 */
export const customerTagSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  count: z.number(),
});

/**
 * Import Customers Result Schema
 */
export const importCustomersResultSchema = z.object({
  imported: z.number(),
  failed: z.number(),
  errors: z.array(
    z.object({
      row: z.number(),
      message: z.string(),
    })
  ),
});

// Type exports from schemas
export type CustomerInput = z.infer<typeof customerSchema>;
export type CustomerWithStatsInput = z.infer<typeof customerWithStatsSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerRequestSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerRequestSchema>;
export type CustomersListInput = z.infer<typeof customersListResponseSchema>;
export type CustomerTagInput = z.infer<typeof customerTagSchema>;
