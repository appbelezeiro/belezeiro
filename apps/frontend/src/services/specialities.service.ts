import { IHttpClient } from "@/infra/contracts/i-http-client";
import { API_ENDPOINTS } from "@/lib/api";

class Service {
  constructor(private httpClient: IHttpClient) { }

  async get(params: Service.GetParams) {
    const url = new URL(API_ENDPOINTS.SPECIALTIES.BASE);

    console.log("URL", params)

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, String(value));
      }
    });

    console.log("URL", url.toString())

    // try {
    //   return await this.httpClient.get(url.toString());
    // } catch (error) {
    //   console.error("Error fetching specialties:", error);
    // }
  }
}

declare namespace Service {
  export type GetParams = {
    q?: string;
    c?: string;
    l?: number;
  }
}

export { Service as SpecialtiesService }