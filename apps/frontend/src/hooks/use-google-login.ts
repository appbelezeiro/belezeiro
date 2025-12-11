// ============================================================================
// GOOGLE LOGIN HOOK - Manages Google OAuth login flow
// ============================================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin as useGoogleOAuth } from "@react-oauth/google";
import { useAuth } from "@/contexts/AuthContext";
import { googleOAuthService } from "@/services/oauth/google.service";
import { handleApiError } from "@/utils/error-handler";
import { toast } from "sonner";

interface UseGoogleLoginReturn {
  handleLogin: () => void;
  isLoading: boolean;
}

/**
 * Hook to handle Google OAuth login flow
 * Encapsulates all login logic including:
 * - Google OAuth flow
 * - API authentication
 * - Navigation
 * - Error handling
 */
export function useGoogleLogin(): UseGoogleLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  /**
   * Google OAuth login handler
   */
  const googleLogin = useGoogleOAuth({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);

      try {
        // 1. Fetch user info from Google and prepare login request
        const loginRequest = await googleOAuthService.handleOAuthCallback(
          tokenResponse.access_token
        );

        // 2. Login with our API
        const user = await login(loginRequest);

        // 3. Navigate to dashboard
        navigate("/dashboard");

        console.log("[Login] Successfully logged in:", user);
      } catch (error) {
        console.error("[Login] Failed to login:", error);
        const processedError = handleApiError(error);
        toast.error(processedError.message);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error("[Login] Google OAuth error:", error);
      toast.error("Falha na autenticação com Google. Tente novamente.");
    },
  });

  return {
    handleLogin: googleLogin,
    isLoading,
  };
}
