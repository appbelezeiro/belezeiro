import { createServices } from "./factories/service.factory";

export function container() {
  const services = createServices();

  return {
    services,
  };
}

export type Container = ReturnType<typeof container>;
