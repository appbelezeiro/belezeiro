import { PrismaClientFake } from '@/infra/clients/prisma-client.fake';
import { RedisClientFake } from '@/infra/clients/redis-client.fake';

export function createClients() {
  const prisma = new PrismaClientFake();
  const redis = new RedisClientFake();

  return {
    prisma,
    redis,
  };
}

export type Clients = ReturnType<typeof createClients>;
