export class RedisClientFake {
  constructor() {
  }

  async connect(): Promise<void> {
  }

  async disconnect(): Promise<void> {
  }

  async get(_key: string): Promise<string | null> {
    return null;
  }

  async set(_key: string, _value: string): Promise<void> {
  }
}
