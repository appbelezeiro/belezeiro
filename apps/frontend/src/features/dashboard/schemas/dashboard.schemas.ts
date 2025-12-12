// ============================================================================
// DASHBOARD SCHEMAS - Zod Validation Schemas for Dashboard Feature
// ============================================================================

import { z } from "zod";

/**
 * Dashboard Stats Schema (matches backend response)
 */
export const dashboardStatsSchema = z.object({
  appointmentsToday: z.object({
    value: z.number(),
    change: z.number(),
    changeLabel: z.string(),
  }),
  newCustomers: z.object({
    value: z.number(),
    change: z.number(),
    changeLabel: z.string(),
  }),
  topService: z.object({
    value: z.string(),
    percentage: z.number(),
    changeLabel: z.string(),
  }),
  peakHours: z.object({
    value: z.string(),
    count: z.number(),
    changeLabel: z.string(),
  }),
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
 * Dashboard Appointment Schema (matches backend response)
 */
export const dashboardAppointmentSchema = z.object({
  id: z.string(),
  client: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    photo: z.string().nullable().optional(),
  }),
  service: z.object({
    id: z.string(),
    name: z.string(),
    duration: z.number(),
  }).nullable(),
  startAt: z.string(),
  endAt: z.string(),
  status: z.string(),
  priceCents: z.number().nullable(),
  notes: z.string().nullable(),
});

/**
 * Dashboard Appointments Response Schema
 */
export const dashboardAppointmentsResponseSchema = z.object({
  items: z.array(dashboardAppointmentSchema),
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
 * Secretary Info Schema (matches backend mock response)
 */
export const secretaryInfoSchema = z.object({
  enabled: z.boolean(),
  stats: z.object({
    messagesHandled: z.number(),
    appointmentsScheduled: z.number(),
    questionsAnswered: z.number(),
  }),
  status: z.string(),
  lastActive: z.string().nullable(),
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
 * Plan Info Schema (matches backend response)
 */
export const planInfoSchema = z.object({
  plan: z.object({
    id: z.string().optional(),
    name: z.string(),
    status: z.string(),
    price: z.number().optional(),
  }),
  limits: z.object({
    bookingsPerMonth: z.number().nullable(),
    customersLimit: z.number().nullable(),
    unitsLimit: z.number().nullable(),
  }),
  usage: z.object({
    bookingsThisMonth: z.number(),
    customersCount: z.number().optional(),
    unitsCount: z.number().optional(),
  }),
  currentPeriodEnd: z.string().nullable().optional(),
  cancelAtPeriodEnd: z.boolean().optional(),
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
 * Dashboard Notification Schema (matches backend response)
 */
export const dashboardNotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  type: z.string(),
  priority: z.string(),
  read: z.boolean(),
  createdAt: z.string(),
});

/**
 * Dashboard Notifications Response Schema
 */
export const dashboardNotificationsResponseSchema = z.object({
  items: z.array(dashboardNotificationSchema),
  unreadCount: z.number(),
  total: z.number(),
});

/**
 * Revenue Data Point Schema (matches backend response)
 */
export const revenueDataPointSchema = z.object({
  date: z.string(),
  amount: z.number(),
  amountFormatted: z.string(),
});

/**
 * Revenue Stats Schema (matches backend response)
 */
export const revenueStatsSchema = z.object({
  data: z.array(revenueDataPointSchema),
  total: z.number(),
  totalFormatted: z.string(),
  change: z.number(),
  changeLabel: z.string(),
  period: z.enum(["day", "week", "month", "year"]),
});

// Type exports from schemas
export type DashboardStatsInput = z.infer<typeof dashboardStatsSchema>;
export type AppointmentStatusInput = z.infer<typeof appointmentStatusSchema>;
export type DashboardAppointmentInput = z.infer<typeof dashboardAppointmentSchema>;
export type SecretaryInfoInput = z.infer<typeof secretaryInfoSchema>;
export type PlanInfoInput = z.infer<typeof planInfoSchema>;
export type NotificationInput = z.infer<typeof dashboardNotificationSchema>;
export type RevenueStatsInput = z.infer<typeof revenueStatsSchema>;
