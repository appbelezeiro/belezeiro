// ============================================================================
// INTERCEPTORS - Automatic Token Refresh & Error Handling
// ============================================================================

import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { privateClient, publicClient } from "./client";
import {
  handleApiError,
  shouldAttemptTokenRefresh,
  shouldRedirectToLogin,
} from "@/utils/error-handler";

/**
 * Queue for failed requests during token refresh
 */
interface FailedRequestQueue {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}

let isRefreshing = false;
let failedRequestsQueue: FailedRequestQueue[] = [];

/**
 * Process all queued requests after refresh completes
 */
function processQueue(error: Error | null = null) {
  failedRequestsQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedRequestsQueue = [];
}

/**
 * Attempt to refresh the access token
 * Uses publicClient with credentials to send refresh_token cookie
 */
async function refreshAccessToken(): Promise<void> {
  try {
    await publicClient.post("/api/auth/refresh", {}, {
      withCredentials: true, // Send refresh_token cookie
    });
  } catch (error) {
    console.error("[Interceptor] Failed to refresh token:", error);
    throw error;
  }
}

/**
 * Setup response interceptor for automatic token refresh
 * This interceptor catches 401 errors and attempts to refresh the token
 */
export function setupTokenRefreshInterceptor(
  onRefreshSuccess?: () => void,
  onRefreshFailure?: () => void
) {
  privateClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      // Process error to get user-friendly message
      const processedError = handleApiError(error);

      // Check if this is a token expiration error
      if (shouldAttemptTokenRefresh(processedError) && !originalRequest._retry) {
        if (isRefreshing) {
          // Token refresh already in progress, queue this request
          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({ resolve, reject });
          })
            .then(() => {
              // After refresh completes, retry the original request
              return privateClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        // Mark this request as retried to avoid infinite loops
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh the token
          await refreshAccessToken();

          // Refresh successful
          isRefreshing = false;
          processQueue();

          // Call success callback if provided
          if (onRefreshSuccess) {
            onRefreshSuccess();
          }

          // Retry the original request with new token
          return privateClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed
          isRefreshing = false;
          processQueue(refreshError as Error);

          // Check if should redirect to login
          const refreshProcessedError = handleApiError(refreshError);
          if (shouldRedirectToLogin(refreshProcessedError)) {
            // Call failure callback if provided
            if (onRefreshFailure) {
              onRefreshFailure();
            }
          }

          return Promise.reject(refreshError);
        }
      }

      // Check if should redirect to login for other errors
      if (shouldRedirectToLogin(processedError)) {
        if (onRefreshFailure) {
          onRefreshFailure();
        }
      }

      return Promise.reject(error);
    }
  );
}

/**
 * Remove token refresh interceptor
 * Useful for cleanup or testing
 */
export function removeTokenRefreshInterceptor() {
  // Clear the queue
  processQueue(new Error("Interceptor removed"));
  isRefreshing = false;

  // Note: Axios doesn't provide a direct way to remove a specific interceptor
  // You would need to store the interceptor ID and use eject
  // For now, we just clear the queue
}

/**
 * Setup request interceptor for logging (development only)
 */
export function setupRequestLoggingInterceptor() {
  const isDevelopment = import.meta.env.VITE_APP_ENV !== "production";

  if (!isDevelopment) {
    return;
  }

  privateClient.interceptors.request.use(
    (config) => {
      console.group(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      console.log("Headers:", config.headers);
      console.log("Data:", config.data);
      console.groupEnd();
      return config;
    },
    (error) => {
      console.error("[API Request] Error:", error);
      return Promise.reject(error);
    }
  );

  privateClient.interceptors.response.use(
    (response) => {
      console.group(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`);
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.groupEnd();
      return response;
    },
    (error) => {
      console.group(`[API Response] Error`);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.groupEnd();
      return Promise.reject(error);
    }
  );
}
