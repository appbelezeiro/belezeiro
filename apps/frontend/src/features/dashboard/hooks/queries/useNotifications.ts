// ============================================================================
// USE NOTIFICATIONS - Query Hook for Dashboard Notifications
// ============================================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardService } from "../../api";
import type { DashboardNotification } from "../../types";

interface UseNotificationsOptions {
  limit?: number;
  enabled?: boolean;
}

const NOTIFICATIONS_KEY = ["dashboard", "notifications"];

/**
 * Query hook to fetch notifications
 */
export function useNotifications({
  limit = 10,
  enabled = true,
}: UseNotificationsOptions = {}) {
  return useQuery<DashboardNotification[], Error>({
    queryKey: [...NOTIFICATIONS_KEY, { limit }],
    queryFn: () => dashboardService.getNotifications(limit),
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

/**
 * Mutation hook to mark a notification as read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (notificationId) =>
      dashboardService.markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });
}

/**
 * Mutation hook to mark all notifications as read
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: () => dashboardService.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    },
  });
}

/**
 * Helper to get unread notifications count
 */
export function useUnreadNotificationsCount() {
  const { data: notifications } = useNotifications();
  return notifications?.filter((n) => !n.read).length ?? 0;
}
