// ============================================================================
// DASHBOARD TYPES - Domain Types for Dashboard Feature
// ============================================================================

/**
 * Dashboard Stats Response (matches backend)
 */
export interface DashboardStats {
  appointmentsToday: {
    value: number;
    change: number;
    changeLabel: string;
  };
  newCustomers: {
    value: number;
    change: number;
    changeLabel: string;
  };
  topService: {
    value: string;
    percentage: number;
    changeLabel: string;
  };
  peakHours: {
    value: string;
    count: number;
    changeLabel: string;
  };
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
 * Dashboard Appointment (matches backend)
 */
export interface DashboardAppointment {
  id: string;
  client: {
    id: string;
    name: string;
    email: string;
    photo?: string | null;
  };
  service: {
    id: string;
    name: string;
    duration: number;
  } | null;
  startAt: string;
  endAt: string;
  status: string;
  priceCents: number | null;
  notes: string | null;
}

/**
 * Dashboard Appointments Response
 */
export interface DashboardAppointmentsResponse {
  items: DashboardAppointment[];
  total: number;
}

/**
 * Secretary Status
 */
export type SecretaryStatus = "active" | "inactive" | "busy" | "offline";

/**
 * AI Secretary Info (matches backend)
 */
export interface SecretaryInfo {
  enabled: boolean;
  stats: {
    messagesHandled: number;
    appointmentsScheduled: number;
    questionsAnswered: number;
  };
  status: string;
  lastActive: string | null;
}

/**
 * Subscription Plan
 */
export type PlanType = "free" | "starter" | "professional" | "enterprise";

/**
 * Plan Status Info (matches backend)
 */
export interface PlanInfo {
  plan: {
    id?: string;
    name: string;
    status: string;
    price?: number;
  };
  limits: {
    bookingsPerMonth: number | null;
    customersLimit: number | null;
    unitsLimit: number | null;
  };
  usage: {
    bookingsThisMonth: number;
    customersCount?: number;
    unitsCount?: number;
  };
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
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
 * Dashboard Notification (matches backend)
 */
export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  read: boolean;
  createdAt: string;
}

/**
 * Dashboard Notifications Response
 */
export interface DashboardNotificationsResponse {
  items: DashboardNotification[];
  unreadCount: number;
  total: number;
}

/**
 * Revenue Data Point (matches backend)
 */
export interface RevenueDataPoint {
  date: string;
  amount: number;
  amountFormatted: string;
}

/**
 * Revenue Stats (matches backend)
 */
export interface RevenueStats {
  data: RevenueDataPoint[];
  total: number;
  totalFormatted: string;
  change: number;
  changeLabel: string;
  period: "day" | "week" | "month" | "year";
}
