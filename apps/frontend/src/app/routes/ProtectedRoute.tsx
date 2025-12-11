// ============================================================================
// PROTECTED ROUTE - Rota protegida para usuários autenticados
// ============================================================================

import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '@/features/auth';

/**
 * Props do componente ProtectedRoute
 */
interface ProtectedRouteProps {
  children: ReactNode;
  /**
   * URL para redirecionar se não autenticado
   * @default '/login'
   */
  redirectTo?: string;
}

/**
 * Componente de loading
 */
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}

/**
 * Componente de rota protegida
 *
 * Envolve rotas que requerem autenticação.
 * Redireciona para login se usuário não está autenticado.
 * Preserva a URL de destino para redirecionamento após login.
 *
 * @example
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   }
 * />
 */
export function ProtectedRoute({
  children,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { data: user, isLoading, isError } = useCurrentUser();
  const location = useLocation();

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return <LoadingState />;
  }

  // Redireciona se não autenticado ou erro
  if (!user || isError) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Usuário autenticado, renderiza conteúdo
  return <>{children}</>;
}
