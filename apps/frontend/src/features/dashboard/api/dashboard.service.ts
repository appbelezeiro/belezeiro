// ============================================================================
// DASHBOARD SERVICE - API Integration for Dashboard Feature
// ============================================================================

import { createApiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/config";
import type {
  DashboardStats,
  DashboardAppointmentsResponse,
  SecretaryInfo,
  PlanInfo,
  DashboardNotification,
  RevenueStats,
} from "../types";
import {
  dashboardStatsSchema,
  dashboardAppointmentsResponseSchema,
  secretaryInfoSchema,
  planInfoSchema,
  dashboardNotificationSchema,
  revenueStatsSchema,
} from "../schemas";

const apiClient = createApiClient();

/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */
class DashboardService {
  /**
   * Get dashboard stats (KPIs)
   */
  async getStats(unitId?: string): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>(
      API_ENDPOINTS.DASHBOARD.STATS,
      {
        params: unitId ? { unitId } : undefined,
      }
    );
    return dashboardStatsSchema.parse(response.data);
  }

  /**
   * Get today's appointments for the dashboard
   */
  async getTodayAppointments(
    unitId?: string
  ): Promise<DashboardAppointmentsResponse> {
    const response = await apiClient.get<DashboardAppointmentsResponse>(
      API_ENDPOINTS.DASHBOARD.RECENT_BOOKINGS,
      {
        params: unitId ? { unitId } : undefined,
      }
    );
    return dashboardAppointmentsResponseSchema.parse(response.data);
  }

  /**
   * Get AI Secretary status
   */
  async getSecretaryInfo(): Promise<SecretaryInfo> {
    const response = await apiClient.get<SecretaryInfo>(
      `${API_ENDPOINTS.DASHBOARD.STATS}/secretary`
    );
    return secretaryInfoSchema.parse(response.data);
  }

  /**
   * Get current plan info
   */
  async getPlanInfo(): Promise<PlanInfo> {
    const response = await apiClient.get<PlanInfo>(
      `${API_ENDPOINTS.DASHBOARD.STATS}/plan`
    );
    return planInfoSchema.parse(response.data);
  }

  /**
   * Get notifications
   */
  async getNotifications(limit = 10): Promise<DashboardNotification[]> {
    const response = await apiClient.get<DashboardNotification[]>(
      `${API_ENDPOINTS.DASHBOARD.STATS}/notifications`,
      {
        params: { limit },
      }
    );
    return response.data.map((n) => dashboardNotificationSchema.parse(n));
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId: string): Promise<void> {
    await apiClient.patch(
      `${API_ENDPOINTS.DASHBOARD.STATS}/notifications/${notificationId}/read`
    );
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(): Promise<void> {
    await apiClient.patch(
      `${API_ENDPOINTS.DASHBOARD.STATS}/notifications/read-all`
    );
  }

  /**
   * Get revenue stats
   */
  async getRevenueStats(
    period: "day" | "week" | "month" | "year" = "month"
  ): Promise<RevenueStats> {
    const response = await apiClient.get<RevenueStats>(
      `${API_ENDPOINTS.DASHBOARD.STATS}/revenue`,
      {
        params: { period },
      }
    );
    return revenueStatsSchema.parse(response.data);
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
export default dashboardService;
