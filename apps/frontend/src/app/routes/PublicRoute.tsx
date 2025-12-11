// ============================================================================
// PUBLIC ROUTE - Rota pública para usuários não autenticados
// ============================================================================

import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '@/features/auth';

/**
 * Props do componente PublicRoute
 */
interface PublicRouteProps {
  children: ReactNode;
  /**
   * URL para redirecionar se já autenticado
   * @default '/dashboard'
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
 * Componente de rota pública
 *
 * Envolve rotas que devem ser acessíveis apenas quando NÃO autenticado.
 * Redireciona usuários autenticados para dashboard (ou rota especificada).
 * Útil para páginas de login/registro.
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
  redirectTo = '/dashboard',
}: PublicRouteProps) {
  const { data: user, isLoading } = useCurrentUser();

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return <LoadingState />;
  }

  // Redireciona se já autenticado
  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Usuário não autenticado, renderiza conteúdo
  return <>{children}</>;
}
