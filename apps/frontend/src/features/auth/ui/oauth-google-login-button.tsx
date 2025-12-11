import { GoogleIcon } from "@/components/GoogleIcon";
import { Button } from "@/components/ui/button";
import { useMakeLogin } from "../hooks/use-make-login";

export function OAuthGoogleLoginButton() {
  const { handleLogin, isLoading } = useMakeLogin();

  return (
    <Button
      variant="google"
      size="lg"
      className="w-full"
      onClick={handleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Autenticando...
        </>
      ) : (
        <>
          <GoogleIcon className="w-5 h-5" />
          {/* Continuar com Google */}
          Continuar com o CHAT
        </>
      )}
    </Button>
  )
}