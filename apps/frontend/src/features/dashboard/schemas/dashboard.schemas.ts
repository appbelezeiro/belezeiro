// ============================================================================
// DASHBOARD SCHEMAS - Zod Validation Schemas for Dashboard Feature
// ============================================================================

import { z } from "zod";

/**
 * Dashboard Stats Schema
 */
export const dashboardStatsSchema = z.object({
  appointmentsToday: z.number(),
  appointmentsChange: z.number(),
  newClients: z.number(),
  newClientsChange: z.number(),
  topService: z.string(),
  topServicePercentage: z.number(),
  peakHours: z.string(),
  peakHoursCount: z.number(),
  revenue: z.number(),
  revenueChange: z.number(),
});

/**
 * Appointment Status Schema
 */
export const appointmentStatusSchema = z.enum([
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
]);

/**
 * Dashboard Appointment Schema
 */
export const dashboardAppointmentSchema = z.object({
  id: z.string(),
  clientName: z.string(),
  clientPhone: z.string(),
  clientPhoto: z.string().optional(),
  serviceName: z.string(),
  serviceColor: z.string(),
  time: z.string(),
  duration: z.number(),
  status: appointmentStatusSchema,
  professionalName: z.string().optional(),
});

/**
 * Dashboard Appointments Response Schema
 */
export const dashboardAppointmentsResponseSchema = z.object({
  appointments: z.array(dashboardAppointmentSchema),
  total: z.number(),
});

/**
 * Secretary Status Schema
 */
export const secretaryStatusSchema = z.enum([
  "active",
  "inactive",
  "busy",
  "offline",
]);

/**
 * Secretary Info Schema
 */
export const secretaryInfoSchema = z.object({
  status: secretaryStatusSchema,
  messagesHandled: z.number(),
  appointmentsBooked: z.number(),
  responseRate: z.number(),
  averageResponseTime: z.number(),
  isEnabled: z.boolean(),
});

/**
 * Plan Type Schema
 */
export const planTypeSchema = z.enum([
  "free",
  "starter",
  "professional",
  "enterprise",
]);

/**
 * Plan Info Schema
 */
export const planInfoSchema = z.object({
  plan: planTypeSchema,
  planName: z.string(),
  daysRemaining: z.number().optional(),
  nextBillingDate: z.string().optional(),
  appointmentsUsed: z.number(),
  appointmentsLimit: z.number(),
  features: z.array(z.string()),
});

/**
 * Notification Type Schema
 */
export const notificationTypeSchema = z.enum([
  "appointment",
  "message",
  "reminder",
  "system",
  "payment",
]);

/**
 * Dashboard Notification Schema
 */
export const dashboardNotificationSchema = z.object({
  id: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  message: z.string(),
  timestamp: z.string(),
  read: z.boolean(),
  actionUrl: z.string().optional(),
});

/**
 * Revenue Data Point Schema
 */
export const revenueDataPointSchema = z.object({
  date: z.string(),
  revenue: z.number(),
  appointments: z.number(),
});

/**
 * Revenue Stats Schema
 */
export const revenueStatsSchema = z.object({
  period: z.enum(["day", "week", "month", "year"]),
  total: z.number(),
  change: z.number(),
  data: z.array(revenueDataPointSchema),
});

// Type exports from schemas
export type DashboardStatsInput = z.infer<typeof dashboardStatsSchema>;
export type AppointmentStatusInput = z.infer<typeof appointmentStatusSchema>;
export type DashboardAppointmentInput = z.infer<
  typeof dashboardAppointmentSchema
>;
export type SecretaryInfoInput = z.infer<typeof secretaryInfoSchema>;
export type PlanInfoInput = z.infer<typeof planInfoSchema>;
export type NotificationInput = z.infer<typeof dashboardNotificationSchema>;
export type RevenueStatsInput = z.infer<typeof revenueStatsSchema>;
