import { createClients } from './factories/clients.factory';
import { createRepositories } from './factories/repositories.factory';
import { createServices } from './factories/services.factory';
import { createUseCases } from './factories/use-cases.factory';

export function container() {
  const clients = createClients();
  const repositories = createRepositories(clients);
  const services = createServices();
  const use_cases = createUseCases(repositories, services);

  return {
    clients,
    repositories,
    services,
    use_cases,
  };
}

export type Container = ReturnType<typeof container>;
