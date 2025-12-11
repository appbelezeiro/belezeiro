// ============================================================================
// HTTP CLIENTS - Axios Configuration
// ============================================================================

import axios, { type AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://api.belezeiro.com.br";
const IS_PRODUCTION = import.meta.env.VITE_APP_ENV === "production";

/**
 * Public HTTP Client
 * Used for endpoints that don't require authentication (login, register, etc.)
 * Does NOT send credentials/cookies
 */
export const publicClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
  withCredentials: false, // ❌ No credentials
});

/**
 * Private HTTP Client
 * Used for authenticated endpoints (requires access token)
 * ALWAYS sends credentials/cookies (httpOnly cookies with tokens)
 */
export const privateClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
  withCredentials: true, // ✅ Always send credentials (cookies)
});

/**
 * Request interceptor for public client
 * Logs requests in development
 */
publicClient.interceptors.request.use(
  (config) => {
    if (!IS_PRODUCTION) {
      console.log(`[Public API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("[Public API] Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * Request interceptor for private client
 * Logs requests in development
 */
privateClient.interceptors.request.use(
  (config) => {
    if (!IS_PRODUCTION) {
      console.log(`[Private API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("[Private API] Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for public client
 * Basic error handling
 */
publicClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!IS_PRODUCTION) {
      console.error("[Public API] Response error:", error);
    }
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for private client
 * Will be enhanced with refresh token logic
 */
privateClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!IS_PRODUCTION) {
      console.error("[Private API] Response error:", error);
    }
    return Promise.reject(error);
  }
);

/**
 * Export API URL for reference
 */
export const API_BASE_URL = API_URL;
