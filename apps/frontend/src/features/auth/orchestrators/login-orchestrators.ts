import { MakeBelezeiroHttpClient, MakeHttpClient } from "@/infra/factories/clients/make-http-client";
import { GoogleOAuthService } from "../services/google-oauth-service";
import { AuthService } from "../services/auth-service";

export class LoginOrchestrator {
  private googleOAuthService: GoogleOAuthService;
  private authService: AuthService;

  constructor() {
    this.googleOAuthService = new GoogleOAuthService(MakeHttpClient());
    this.authService = new AuthService(MakeBelezeiroHttpClient());
  }

  async run(token: string) {
    const user = await this.googleOAuthService.getUserInfoFromToken(token);

    const register = await this.authService.login({
      name: user.name,
      email: user.email,
      photoUrl: user.picture,
      providerId: user.sub
    });

    const profile = await this.authService.me();

    let result: LoginOrchestratorOutput = {
      user: profile,
      redirectTo: undefined
    };

    if (register.pending_actions && Object.keys(register.pending_actions).length > 0) {
      if (register.pending_actions["0"] === "initial_register") {
        result.redirectTo = "/onboarding";
      }
    }

    return result;
  }
}

export interface LoginOrchestratorOutput {
  user: Pick<AuthService.MeOutput, "user">;
  redirectTo: string | undefined;
}