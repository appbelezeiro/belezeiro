import { MakeHttpClient } from "@/infra/factories/clients/make-http-client";
import { SpecialtiesService } from "@/services/specialities.service";

export function createServices() {
  const httpClient = MakeHttpClient();

  const specialities_service = new SpecialtiesService(httpClient);

  return {
    specialities_service,
  };
}

export type Services = ReturnType<typeof createServices>;
