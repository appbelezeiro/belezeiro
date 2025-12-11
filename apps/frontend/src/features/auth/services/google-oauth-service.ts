import { HttpStatusCode, IHttpClient } from "@/infra/contracts/i-http-client";
import { GoogleOAuthUserInfoResponseSchema } from "../schemas/google-oauth-user-info-response";
import { ZodError } from "zod";

export class GoogleOAuthService {
  private GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  private GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

  constructor(private httpClient: IHttpClient) { }

  getClientId() {
    if (!this.GOOGLE_CLIENT_ID) {
      throw new Error(
        "VITE_GOOGLE_CLIENT_ID is not defined in environment variables"
      );
    }
    return this.GOOGLE_CLIENT_ID;
  }

  async getUserInfoFromToken(token: string) {
    try {
      const response = await this.httpClient.get(this.GOOGLE_USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error(
          `Failed to fetch user info from Google: ${response.statusText}`
        );
      }

      return GoogleOAuthUserInfoResponseSchema.parse(response.data);
    } catch (error) {
      if (error instanceof ZodError) {
        console.log(error.errors);
      }

      console.error("[GoogleOAuth] Error fetching user info:", error);
      throw new Error("Failed to fetch user information from Google");
    }
  }
}