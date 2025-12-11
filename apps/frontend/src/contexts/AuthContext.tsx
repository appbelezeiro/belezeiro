// ============================================================================
// AUTH CONTEXT - Authentication State Management
// ============================================================================

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { User, LoginRequest, AuthContextType } from "@/types/auth.types";
import { authService } from "@/services/api/auth.service";
import { setupTokenRefreshInterceptor } from "@/services/api/interceptors";
import { handleApiError } from "@/utils/error-handler";
import { toast } from "sonner";

/**
 * Auth Context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider Props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 * Manages authentication state and provides auth methods to the app
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Check authentication status on mount
   */
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await authService.checkAuth();
      setUser(currentUser);
    } catch (error) {
      console.error("[Auth] Failed to check authentication:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Login user with OAuth credentials
   */
  const login = useCallback(
    async (request: LoginRequest): Promise<User> => {
      try {
        const loggedInUser = await authService.login(request);
        setUser(loggedInUser);

        toast.success(`Bem-vindo, ${loggedInUser.name}!`);

        return loggedInUser;
      } catch (error) {
        const processedError = handleApiError(error);
        toast.error(processedError.message);
        throw error;
      }
    },
    []
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success("Desconectado com sucesso!");
      navigate("/login");
    } catch (error) {
      // Even if logout fails on backend, clear local state
      setUser(null);
      const processedError = handleApiError(error);
      toast.error(processedError.message);
      navigate("/login");
    }
  }, [navigate]);

  /**
   * Refresh access token
   */
  const refreshToken = useCallback(async () => {
    try {
      await authService.refreshToken();
      console.log("[Auth] Token refreshed successfully");
    } catch (error) {
      console.error("[Auth] Failed to refresh token:", error);
      throw error;
    }
  }, []);

  /**
   * Handle token refresh success
   */
  const handleRefreshSuccess = useCallback(() => {
    console.log("[Auth] Token refresh successful");
  }, []);

  /**
   * Handle token refresh failure - logout user
   */
  const handleRefreshFailure = useCallback(() => {
    console.log("[Auth] Token refresh failed - logging out");
    setUser(null);
    toast.error("Sua sessão expirou. Por favor, faça login novamente.");
    navigate("/login");
  }, [navigate]);

  /**
   * Setup token refresh interceptor on mount
   */
  useEffect(() => {
    setupTokenRefreshInterceptor(handleRefreshSuccess, handleRefreshFailure);
  }, [handleRefreshSuccess, handleRefreshFailure]);

  /**
   * Check auth on mount
   */
  useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

/**
 * Hook to get current user
 * Convenience hook that extracts just the user from context
 */
export function useCurrentUser(): User | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to check if user is authenticated
 * Convenience hook that extracts just the auth status
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}
