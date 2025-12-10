import { IQueue } from '@/application/contracts/i-queue.interface';

type QueueHandler<T> = (message: T) => Promise<void>;

export class InMemoryQueueAdapter implements IQueue {
  private handlers: Map<string, QueueHandler<any>[]> = new Map();
  private messages: Array<{ topic: string; message: any }> = [];

  async publish<T>(topic: string, message: T): Promise<void> {
    // Armazena mensagem para inspeção (útil em testes)
    this.messages.push({ topic, message });

    // Dispara handlers registrados
    const handlers = this.handlers.get(topic) || [];

    for (const handler of handlers) {
      try {
        await handler(message);
      } catch (error) {
        console.error(`Error processing message on topic ${topic}:`, error);
        // Em produção, implementar retry/DLQ aqui
      }
    }
  }

  async subscribe<T>(topic: string, handler: QueueHandler<T>): Promise<void> {
    const existing = this.handlers.get(topic) || [];
    this.handlers.set(topic, [...existing, handler]);
  }

  // Métodos auxiliares para testes
  get_messages(): Array<{ topic: string; message: any }> {
    return this.messages;
  }

  clear_messages(): void {
    this.messages = [];
  }

  get_messages_by_topic(topic: string): any[] {
    return this.messages.filter((m) => m.topic === topic).map((m) => m.message);
  }
}
