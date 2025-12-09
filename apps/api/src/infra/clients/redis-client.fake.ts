export class RedisClientFake {
  constructor() {
  }

  async connect(): Promise<void> {
  }

  async disconnect(): Promise<void> {
  }

  async get(key: string): Promise<string | null> {
    return null;
  }

  async set(key: string, value: string): Promise<void> {
  }
}
