// ============================================================================
// DASHBOARD TYPES - Domain Types for Dashboard Feature
// ============================================================================

/**
 * KPI Data for Dashboard Cards
 */
export interface KPI {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: string;
}

/**
 * Dashboard Stats Response
 */
export interface DashboardStats {
  appointmentsToday: number;
  appointmentsChange: number;
  newClients: number;
  newClientsChange: number;
  topService: string;
  topServicePercentage: number;
  peakHours: string;
  peakHoursCount: number;
  revenue: number;
  revenueChange: number;
}

/**
 * Appointment Status
 */
export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

/**
 * Appointment for Dashboard List
 */
export interface DashboardAppointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientPhoto?: string;
  serviceName: string;
  serviceColor: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  professionalName?: string;
}

/**
 * Dashboard Appointments Response
 */
export interface DashboardAppointmentsResponse {
  appointments: DashboardAppointment[];
  total: number;
}

/**
 * Secretary Status
 */
export type SecretaryStatus = "active" | "inactive" | "busy" | "offline";

/**
 * AI Secretary Info
 */
export interface SecretaryInfo {
  status: SecretaryStatus;
  messagesHandled: number;
  appointmentsBooked: number;
  responseRate: number;
  averageResponseTime: number; // in seconds
  isEnabled: boolean;
}

/**
 * Subscription Plan
 */
export type PlanType = "free" | "starter" | "professional" | "enterprise";

/**
 * Plan Status Info
 */
export interface PlanInfo {
  plan: PlanType;
  planName: string;
  daysRemaining?: number;
  nextBillingDate?: string;
  appointmentsUsed: number;
  appointmentsLimit: number;
  features: string[];
}

/**
 * Notification Type
 */
export type NotificationType =
  | "appointment"
  | "message"
  | "reminder"
  | "system"
  | "payment";

/**
 * Dashboard Notification
 */
export interface DashboardNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

/**
 * Revenue Data Point (for charts)
 */
export interface RevenueDataPoint {
  date: string;
  revenue: number;
  appointments: number;
}

/**
 * Revenue Stats
 */
export interface RevenueStats {
  period: "day" | "week" | "month" | "year";
  total: number;
  change: number;
  data: RevenueDataPoint[];
}
