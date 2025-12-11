// ============================================================================
// PROTECTED ROUTE - Route Guard for Authenticated Users
// ============================================================================

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * If true, this route is part of the onboarding flow and will be accessible
   * even if the user hasn't completed onboarding.
   * @default false
   */
  allowDuringOnboarding?: boolean;
}

// Routes that are part of the onboarding flow
const ONBOARDING_ROUTES = ['/onboarding', '/onboarding/plans', '/onboarding/success', '/bem-vindo'];

/**
 * Protected Route Component
 *
 * Wraps routes that require authentication.
 * - Redirects to login if user is not authenticated.
 * - Redirects to onboarding if user hasn't completed onboarding (unless route allows it).
 * - Preserves the intended destination for redirect after login.
 *
 * @example
 * // Regular protected route - requires onboarding completion
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * @example
 * // Onboarding route - accessible during onboarding
 * <Route
 *   path="/onboarding"
 *   element={
 *     <ProtectedRoute allowDuringOnboarding>
 *       <OnboardingPage />
 *     </ProtectedRoute>
 *   }
 * />
 */
export function ProtectedRoute({ children, allowDuringOnboarding = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

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

  // Redirect to login if not authenticated
  // Preserve the current location for redirect after login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check onboarding status
  const isOnboardingRoute = ONBOARDING_ROUTES.some(route =>
    location.pathname.startsWith(route)
  ) || allowDuringOnboarding;

  // If user hasn't completed onboarding and this isn't an onboarding route,
  // redirect to onboarding
  if (user && !user.onboardingCompleted && !isOnboardingRoute) {
    return <Navigate to="/onboarding" replace />;
  }

  // If user has completed onboarding and is trying to access onboarding route,
  // redirect to dashboard (optional - can be removed if you want to allow revisiting)
  // Commenting this out to allow users to revisit onboarding routes if needed
  // if (user && user.onboardingCompleted && isOnboardingRoute && location.pathname !== '/bem-vindo') {
  //   return <Navigate to="/dashboard" replace />;
  // }

  // User is authenticated and passes onboarding check, render the protected content
  return <>{children}</>;
}
