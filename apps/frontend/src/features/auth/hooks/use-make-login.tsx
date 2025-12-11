import { useMemo, useState } from "react"
import { useGoogleLogin as useGoogleOAuth } from "@react-oauth/google";

import { LoginOrchestrator } from "../orchestrators/login-orchestrators";
import { useNavigate } from "react-router-dom";

export const useMakeLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const orchestrator = useMemo(() => new LoginOrchestrator(), []);

  const googleLogin = useGoogleOAuth({
    onSuccess: async (credentials) => {
      setIsLoading(true);

      const token = credentials.access_token;

      try {
        const { user, redirectTo } = await orchestrator.run(token);

        console.log({ user, redirectTo });

        if (redirectTo) {
          navigate(redirectTo);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      

      setIsLoading(false);
    },
  });

  return { handleLogin: googleLogin, isLoading };
}