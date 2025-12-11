import { IHttpClient } from "@/infra/contracts/i-http-client";
import { LoginAuthServiceResponseSchema, LoginAuthServiceResponse } from "../schemas/login-auth-service-response";

class Service {
  constructor(private httpClient: IHttpClient) { }

  async login(input: Service.LoginInput): Promise<Service.LoginOutput> {
    const response = await this.httpClient.post<Service.LoginOutput>("/auth/login", input, {
      withCredentials: true,
    });

    return LoginAuthServiceResponseSchema.parse(response.data);
  }

  async me(): Promise<Service.MeOutput> {
    const response = await this.httpClient.get<Service.MeOutput>("/auth/me", {
      withCredentials: true,
    });

    return response.data
  }
}

declare namespace Service {
  type LoginInput = {
    name: string;
    email: string;
    providerId: string;
    photoUrl?: string;
  };

  type LoginOutput = LoginAuthServiceResponse;

  type MeOutput = {
    user: {
      id: string
      name: string
      email: string
      photo: string
      isActive: boolean
    }
  }
};

export { Service as AuthService };