import { createClients } from './factories/clients.factory';
import { createRepositories } from './factories/repositories.factory';
import { createUseCases } from './factories/use-cases.factory';

export function container() {
  const clients = createClients();
  const repositories = createRepositories(clients);
  const use_cases = createUseCases(repositories);

  return {
    clients,
    repositories,
    use_cases,
  };
}

export type Container = ReturnType<typeof container>;
