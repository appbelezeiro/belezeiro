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
  DashboardNotificationsResponse,
  RevenueStats,
} from "../types";
import {
  dashboardStatsSchema,
  dashboardAppointmentsResponseSchema,
  secretaryInfoSchema,
  planInfoSchema,
  dashboardNotificationsResponseSchema,
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
  async getStats(unitId: string): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>(
      API_ENDPOINTS.DASHBOARD.STATS,
      {
        params: { unitId },
      }
    );
    return dashboardStatsSchema.parse(response.data);
  }

  /**
   * Get today's appointments for the dashboard
   */
  async getTodayAppointments(
    unitId: string
  ): Promise<DashboardAppointmentsResponse> {
    const response = await apiClient.get<DashboardAppointmentsResponse>(
      API_ENDPOINTS.DASHBOARD.RECENT_BOOKINGS,
      {
        params: { unitId },
      }
    );
    return dashboardAppointmentsResponseSchema.parse(response.data);
  }

  /**
   * Get AI Secretary status
   */
  async getSecretaryInfo(): Promise<SecretaryInfo> {
    const response = await apiClient.get<SecretaryInfo>(
      API_ENDPOINTS.DASHBOARD.SECRETARY
    );
    return secretaryInfoSchema.parse(response.data);
  }

  /**
   * Get current plan info
   */
  async getPlanInfo(unitId: string): Promise<PlanInfo> {
    const response = await apiClient.get<PlanInfo>(
      API_ENDPOINTS.DASHBOARD.PLAN,
      {
        params: { unitId },
      }
    );
    return planInfoSchema.parse(response.data);
  }

  /**
   * Get notifications
   */
  async getNotifications(limit = 10): Promise<DashboardNotificationsResponse> {
    const response = await apiClient.get<DashboardNotificationsResponse>(
      API_ENDPOINTS.DASHBOARD.NOTIFICATIONS,
      {
        params: { limit },
      }
    );
    return dashboardNotificationsResponseSchema.parse(response.data);
  }

  /**
   * Mark notification as read
   */
  async markNotificationRead(notificationId: string): Promise<void> {
    await apiClient.patch(
      API_ENDPOINTS.DASHBOARD.NOTIFICATION_READ(notificationId)
    );
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsRead(): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.DASHBOARD.NOTIFICATIONS_READ_ALL);
  }

  /**
   * Get revenue stats
   */
  async getRevenueStats(
    unitId: string,
    period: "day" | "week" | "month" | "year" = "month"
  ): Promise<RevenueStats> {
    const response = await apiClient.get<RevenueStats>(
      API_ENDPOINTS.DASHBOARD.REVENUE,
      {
        params: { unitId, period },
      }
    );
    return revenueStatsSchema.parse(response.data);
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();
export default dashboardService;
