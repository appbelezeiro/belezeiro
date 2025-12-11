import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { useGoogleLogin as useGoogleOAuth } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import type { User, AuthContextType } from "@/types/auth.types";
import { LoginOrchestrator } from "../orchestrators/login-orchestrators";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const orchestrator = useMemo(() => new LoginOrchestrator(), []);

  const googleLogin = useGoogleOAuth({
    onSuccess: async (credentials) => {
      setIsLoading(true);

      try {
        const token = credentials.access_token;

        const user = await this.googleOAuthService.getUserInfoFromToken(token);

        const { user, actions } = await this.authService.login({
          name: user.name,
          email: user.email,
          photoUrl: user.picture,
          providerId: user.sub
        });

        navigate()
      } catch (error) {
        
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      

      setIsLoading(false);
    },
  });

  
  useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: googleLogin,
    logout: () => {},
    checkAuth: () => {},
    refreshToken: () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export function useCurrentUser(): User | null {
  const { user } = useAuth();
  return user;
}

export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}
