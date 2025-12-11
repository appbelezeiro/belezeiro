// ============================================================================
// PUBLIC ROUTE - Route Guard for Non-Authenticated Users
// ============================================================================

import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Public Route Component
 *
 * Wraps routes that should only be accessible when NOT authenticated.
 * Redirects authenticated users to dashboard (or specified route).
 * Useful for login/register pages to prevent authenticated users from accessing them.
 *
 * @example
 * <Route
 *   path="/login"
 *   element={
 *     <PublicRoute redirectTo="/dashboard">
 *       <LoginPage />
 *     </PublicRoute>
 *   }
 * />
 */
export function PublicRoute({
  children,
  redirectTo = "/dashboard",
}: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // User is not authenticated, render the public content
  return <>{children}</>;
}
