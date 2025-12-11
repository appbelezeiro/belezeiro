// ============================================================================
// QUERY CONFIG - React Query Configuration with Performance Optimizations
// ============================================================================

import { QueryClient } from "@tanstack/react-query";

/**
 * Stale time configurations by data type
 * These determine how long data is considered "fresh"
 */
export const STALE_TIMES = {
  /** Static data that rarely changes (categories, settings) */
  STATIC: 30 * 60 * 1000, // 30 minutes

  /** Semi-static data (services, business info) */
  SEMI_STATIC: 5 * 60 * 1000, // 5 minutes

  /** Frequently changing data (bookings, appointments) */
  DYNAMIC: 60 * 1000, // 1 minute

  /** Real-time data (dashboard stats) */
  REALTIME: 30 * 1000, // 30 seconds

  /** User session data */
  SESSION: 5 * 60 * 1000, // 5 minutes
} as const;

/**
 * Cache time configurations
 * These determine how long data stays in cache after becoming unused
 */
export const CACHE_TIMES = {
  /** Long-lived cache for static data */
  LONG: 60 * 60 * 1000, // 1 hour

  /** Medium cache for regular data */
  MEDIUM: 10 * 60 * 1000, // 10 minutes

  /** Short cache for dynamic data */
  SHORT: 5 * 60 * 1000, // 5 minutes
} as const;

/**
 * Retry configurations by error type
 */
export const RETRY_CONFIG = {
  /** Maximum retry attempts */
  MAX_RETRIES: 3,

  /** Retry delay in milliseconds */
  RETRY_DELAY: 1000,

  /** Should retry on specific status codes */
  shouldRetry: (failureCount: number, error: unknown): boolean => {
    // Don't retry on 4xx errors (client errors)
    if (error instanceof Error && "status" in error) {
      const status = (error as { status: number }).status;
      if (status >= 400 && status < 500) {
        return false;
      }
    }
    return failureCount < RETRY_CONFIG.MAX_RETRIES;
  },
} as const;

/**
 * Default query options optimized for performance
 */
export const DEFAULT_QUERY_OPTIONS = {
  staleTime: STALE_TIMES.DYNAMIC,
  gcTime: CACHE_TIMES.MEDIUM,
  retry: RETRY_CONFIG.shouldRetry,
  retryDelay: (attemptIndex: number) =>
    Math.min(RETRY_CONFIG.RETRY_DELAY * 2 ** attemptIndex, 30000),
  refetchOnWindowFocus: false, // Disabled to reduce unnecessary requests
  refetchOnReconnect: true,
  refetchOnMount: true,
} as const;

/**
 * Creates an optimized QueryClient instance
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...DEFAULT_QUERY_OPTIONS,
      },
      mutations: {
        retry: false, // Don't retry mutations by default
        onError: (error) => {
          console.error("Mutation error:", error);
        },
      },
    },
  });
}

/**
 * Query key prefetching utilities
 */
export const prefetchUtils = {
  /**
   * Prefetch critical data on app load
   */
  prefetchCriticalData: async (queryClient: QueryClient) => {
    // This can be extended to prefetch commonly needed data
    // on app startup for better perceived performance
  },

  /**
   * Prefetch data when user hovers over a link
   * Useful for improving navigation speed
   */
  prefetchOnHover: (
    queryClient: QueryClient,
    queryKey: readonly unknown[],
    queryFn: () => Promise<unknown>
  ) => {
    return () => {
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: STALE_TIMES.DYNAMIC,
      });
    };
  },
};

/**
 * Cache invalidation utilities
 */
export const cacheUtils = {
  /**
   * Invalidate all queries in a scope
   */
  invalidateScope: (queryClient: QueryClient, scope: string) => {
    queryClient.invalidateQueries({ queryKey: [scope] });
  },

  /**
   * Clear entire cache (useful on logout)
   */
  clearAll: (queryClient: QueryClient) => {
    queryClient.clear();
  },

  /**
   * Remove specific query from cache
   */
  remove: (queryClient: QueryClient, queryKey: readonly unknown[]) => {
    queryClient.removeQueries({ queryKey });
  },
};
