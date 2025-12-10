/**
 * Exemplo de como rodar workers localmente com in-memory queue
 *
 * Este arquivo demonstra como:
 * 1. Configurar uma fila in-memory
 * 2. Registrar workers para processar mensagens
 * 3. Simular publicação de eventos
 * 4. Processar notificações end-to-end
 */

import { EmailWorker } from '../workers/email-worker';
import { WhatsAppWorker } from '../workers/whatsapp-worker';
import { PushWorker } from '../workers/push-worker';
import type { NotificationEvent } from '../types/notification-event';

// Simulação de adapters (substituir por implementações reais)
class InMemoryQueue {
  private handlers: Map<string, Array<(message: any) => Promise<void>>> = new Map();

  async publish<T>(topic: string, message: T): Promise<void> {
    console.log(`[Queue] Publishing to ${topic}:`, message);

    const handlers = this.handlers.get(topic) || [];
    for (const handler of handlers) {
      try {
        await handler(message);
      } catch (error) {
        console.error(`[Queue] Error processing message on ${topic}:`, error);
      }
    }
  }

  async subscribe<T>(topic: string, handler: (message: T) => Promise<void>): Promise<void> {
    const existing = this.handlers.get(topic) || [];
    this.handlers.set(topic, [...existing, handler]);
    console.log(`[Queue] Subscribed to ${topic}`);
  }
}

class MockEmailProvider {
  async send_email(input: any) {
    console.log(`[MockEmailProvider] Sending email to ${input.to}`);
    console.log(`  Subject: ${input.subject}`);
    console.log(`  HTML: ${input.html.substring(0, 100)}...`);
    return { provider_id: `mock_email_${Date.now()}` };
  }
}

class MockWhatsAppProvider {
  async send_whatsapp(input: any) {
    console.log(`[MockWhatsAppProvider] Sending WhatsApp to ${input.to}`);
    console.log(`  Message: ${input.message.substring(0, 100)}...`);
    return { provider_id: `mock_whatsapp_${Date.now()}` };
  }
}

class MockPushProvider {
  async send_push(input: any) {
    console.log(`[MockPushProvider] Sending push to ${input.user_id}`);
    console.log(`  Title: ${input.title}`);
    console.log(`  Body: ${input.body}`);
    return { provider_id: `mock_push_${Date.now()}` };
  }
}

class HandlebarsRenderer {
  render(template: string, variables: Record<string, any>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value));
    }
    return result;
  }
}

class MockNotificationRepository {
  private notifications = new Map<string, any>();

  async find_by_id(id: string) {
    const notification = this.notifications.get(id) || {
      id,
      mark_as_sent: (provider_id: string) => {
        console.log(`[Notification ${id}] Marked as sent with provider_id: ${provider_id}`);
      },
      mark_as_failed: (error: string) => {
        console.log(`[Notification ${id}] Marked as failed: ${error}`);
      },
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async update(entity: any) {
    console.log(`[Repository] Updated notification ${entity.id}`);
    return entity;
  }
}

class MockTemplateRepository {
  async find_by_id(id: string) {
    // Templates de exemplo
    const templates: Record<string, any> = {
      'welcome_email': {
        id: 'welcome_email',
        name: 'welcome_email',
        channel: 'email',
        subject: 'Welcome {{user_name}}!',
        body_template: '<h1>Hello {{user_name}}</h1><p>Welcome to our platform!</p>',
      },
      'welcome_whatsapp': {
        id: 'welcome_whatsapp',
        name: 'welcome_whatsapp',
        channel: 'whatsapp',
        body_template: 'Hello {{user_name}}, welcome to our platform!',
      },
      'welcome_push': {
        id: 'welcome_push',
        name: 'welcome_push',
        channel: 'push',
        title_template: 'Welcome!',
        body_template: 'Hello {{user_name}}, welcome to our platform!',
      },
    };

    return templates[id] || null;
  }
}

async function main() {
  console.log('\n=== Local Queue Worker Example ===\n');

  // 1. Inicializar dependências
  const queue = new InMemoryQueue();
  const email_provider = new MockEmailProvider();
  const whatsapp_provider = new MockWhatsAppProvider();
  const push_provider = new MockPushProvider();
  const template_renderer = new HandlebarsRenderer();
  const notification_repository = new MockNotificationRepository();
  const template_repository = new MockTemplateRepository();

  // 2. Criar workers
  const email_worker = new EmailWorker(
    email_provider,
    template_renderer,
    notification_repository,
    template_repository
  );

  const whatsapp_worker = new WhatsAppWorker(
    whatsapp_provider,
    template_renderer,
    notification_repository,
    template_repository
  );

  const push_worker = new PushWorker(
    push_provider,
    template_renderer,
    notification_repository,
    template_repository
  );

  // 3. Registrar workers na fila
  await queue.subscribe<NotificationEvent>('notifications.email', (event) =>
    email_worker.process(event)
  );

  await queue.subscribe<NotificationEvent>('notifications.whatsapp', (event) =>
    whatsapp_worker.process(event)
  );

  await queue.subscribe<NotificationEvent>('notifications.push', (event) =>
    push_worker.process(event)
  );

  console.log('Workers registered and listening...\n');

  // 4. Simular envio de notificações
  console.log('--- Sending test notifications ---\n');

  // Email
  const email_event: NotificationEvent = {
    notification_id: 'notif_001',
    message_id: 'msg_001',
    target_user_id: 'user_123',
    channel: 'email',
    template_id: 'welcome_email',
    payload: {
      user_name: 'John Doe',
      email: 'john@example.com',
    },
    priority: 'normal',
  };

  await queue.publish('notifications.email', email_event);

  // WhatsApp
  const whatsapp_event: NotificationEvent = {
    notification_id: 'notif_002',
    message_id: 'msg_002',
    target_user_id: 'user_123',
    channel: 'whatsapp',
    template_id: 'welcome_whatsapp',
    payload: {
      user_name: 'John Doe',
      phone: '+5511999999999',
    },
    priority: 'normal',
  };

  await queue.publish('notifications.whatsapp', whatsapp_event);

  // Push
  const push_event: NotificationEvent = {
    notification_id: 'notif_003',
    message_id: 'msg_003',
    target_user_id: 'user_123',
    channel: 'push',
    template_id: 'welcome_push',
    payload: {
      user_name: 'John Doe',
      push_token: 'device_token_abc123',
    },
    priority: 'normal',
  };

  await queue.publish('notifications.push', push_event);

  console.log('\n=== All notifications processed ===\n');
}

// Executar exemplo se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main as run_local_example };
