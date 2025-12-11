import { FlowDebugControl } from "@/components/debug/FlowDebugControl";
import { GoogleLoginButton, useGoogleLogin } from "@/features/auth";
import loginImage from "@/assets/login-spa-image.jpg";

const Login = () => {
  const { login, isLoading, isError, error } = useGoogleLogin();

  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Image */}
      <section className="hidden lg:block lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        <img
          src={loginImage}
          alt="Ambiente de spa tranquilo com toalhas, plantas e pedras zen"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-calm/10 to-transparent" />

        {/* Floating badge */}
        <div className="absolute bottom-8 left-8 right-8 animate-float">
          <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 shadow-card max-w-sm">
            <p className="text-sm text-muted-foreground mb-1">Mais de 1.000 profissionais confiam no</p>
            <p className="text-xl font-semibold text-foreground">Belezeiro</p>
          </div>
        </div>
      </section>

      {/* Right Side - Login Content */}
      <section className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20 gradient-calm min-h-screen lg:min-h-0">
        <div className="w-full max-w-md mx-auto space-y-10">
          {/* Logo & Brand */}
          <header className="space-y-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-soft">
                <svg
                  className="w-7 h-7 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Belezeiro</h1>
            </div>
          </header>

          {/* Welcome Text */}
          <div className="space-y-3">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              Bem-vindo ao Belezeiro
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Gerencie sua agenda com tranquilidade. Faça login ou crie sua conta para começar.
            </p>
          </div>

          {/* Login Button */}
          <div className="space-y-4">
            <GoogleLoginButton onClick={login} isLoading={isLoading} />

            {isError && error && (
              <p className="text-center text-sm text-destructive">
                {error.message}
              </p>
            )}

            <p className="text-center text-xs text-muted-foreground">
              Faça login ou crie sua conta em segundos
            </p>

            <p className="text-center text-sm text-muted-foreground pt-2">
              Ao continuar, você concorda com nossos{" "}
              <a href="#" className="text-primary hover:underline underline-offset-4">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="#" className="text-primary hover:underline underline-offset-4">
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>

        {/* Mobile Image Preview */}
        <div className="lg:hidden mt-12">
          <div className="relative rounded-2xl overflow-hidden shadow-card mx-auto max-w-sm">
            <img
              src={loginImage}
              alt="Ambiente de spa tranquilo"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-calm/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-primary-foreground text-sm font-medium">
                Sua beleza, nossa prioridade ✨
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Debug Control */}
      <FlowDebugControl />
    </main>
  );
};

export default Login;
