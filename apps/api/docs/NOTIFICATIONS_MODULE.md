# Notifications & Communication Module

Sistema completo de notificações multi-channel com suporte a Email, WhatsApp e Push.

## Visão Geral

Este módulo implementa um sistema de notificações desacoplado, moderno e funcional que segue a arquitetura Clean Architecture + DDD do projeto.

### Características Principais

- ✅ **Multi-channel**: Email, WhatsApp, Push
- ✅ **Multi-channel por notificação**: Um evento pode disparar múltiplos canais simultaneamente
- ✅ **Orquestrador**: Decide canais baseado em tipo de evento e preferências do usuário
- ✅ **Workers assíncronos**: Processa filas em background (app `jobs`)
- ✅ **Abstrações**: Contratos para filas e providers (fácil trocar implementações)
- ✅ **Templates**: Sistema de templates com Handlebars
- ✅ **Preferências de usuário**: Controle granular por canal e categoria
- ✅ **Retries e idempotência**: Retry com backoff + deduplicação via `message_id`
- ✅ **Observabilidade**: Logs estruturados e métricas

## Arquitetura

```
┌────────────────────────────────────────────────────────┐
│                    API (apps/api)                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  SendNotificationUseCase                         │  │
│  │  - Valida canais                                 │  │
│  │  - Checa preferências do usuário                 │  │
│  │  - Cria NotificationEntity                       │  │
│  │  - Publica evento na fila (IQueue)               │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                    │
│                     ▼                                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  IQueue (abstração)                              │  │
│  │  - publish(topic, message)                       │  │
│  │  - subscribe(topic, handler)                     │  │
│  └──────────────────┬───────────────────────────────┘  │
└─────────────────────┼────────────────────────────────────┘
                      │ topics: notifications.{email|whatsapp|push}
                      ▼
┌────────────────────────────────────────────────────────┐
│                  Jobs (apps/jobs)                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  EmailWorker / WhatsAppWorker / PushWorker       │  │
│  │  - Consume fila (subscribe)                      │  │
│  │  - Busca template                                │  │
│  │  - Renderiza com payload                         │  │
│  │  - Envia via provider (IEmailProvider, etc)      │  │
│  │  - Atualiza status da notificação                │  │
│  │  - Log + métricas                                │  │
│  └──────────────────┬───────────────────────────────┘  │
│                     │                                    │
│                     ▼                                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  IEmailProvider / IWhatsAppProvider / ...        │  │
│  │  - send_email() / send_whatsapp() / send_push()  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

## Estrutura do Código

### Domain Layer (`apps/api/src/domain`)

**Entities:**
- `NotificationEntity` - Notificação individual
- `NotificationTemplateEntity` - Template de notificação
- `NotificationPreferenceEntity` - Preferências do usuário

**Errors:**
- `InvalidChannelError` - Canal inválido
- `TemplateNotFoundError` - Template não encontrado
- `TemplateVariablesMismatchError` - Variáveis do template não batem

**Services:**
- `ITemplateRenderer` - Interface para renderização de templates

### Application Layer (`apps/api/src/application`)

**Contracts (Interfaces):**
- `IQueue` - Abstração de fila
- `IEmailProvider` - Provedor de email
- `IWhatsAppProvider` - Provedor de WhatsApp
- `IPushProvider` - Provedor de push
- `INotificationRepository` - Repositório de notificações
- `INotificationTemplateRepository` - Repositório de templates
- `INotificationPreferenceRepository` - Repositório de preferências

**Use Cases:**
- `SendNotificationUseCase` - Orquestrador principal
- `RenderTemplateUseCase` - Renderiza templates
- `GetUserNotificationPreferencesUseCase` - Busca preferências

### Infrastructure Layer (`apps/api/src/infra`)

**Adapters:**
- `InMemoryQueueAdapter` - Fila em memória (para testes)
- `MockEmailProviderAdapter` - Mock de email
- `MockWhatsAppProviderAdapter` - Mock de WhatsApp
- `MockPushProviderAdapter` - Mock de push

**Services:**
- `HandlebarsTemplateRendererService` - Renderização com Handlebars

**Repositories:**
- `InMemoryNotificationRepository`
- `InMemoryNotificationTemplateRepository`
- `InMemoryNotificationPreferenceRepository`

### Jobs App (`apps/jobs`)

**Workers:**
- `EmailWorker` - Processa notificações de email
- `WhatsAppWorker` - Processa notificações de WhatsApp
- `PushWorker` - Processa notificações de push

## Fluxos Principais

### 1. Enviar Notificação Multi-Channel

```typescript
const notifications = await send_notification_usecase.execute({
  target_user_id: 'user_123',
  channels: ['email', 'whatsapp', 'push'],
  template_id: 'tmpl_welcome',
  payload: {
    user_name: 'John Doe',
    email: 'john@example.com',
    phone: '+5511999999999',
  },
  priority: 'high',
  category: 'transactional',
});

// Resultado: 3 notificações criadas (1 por canal)
// 3 eventos publicados na fila
```

### 2. Worker Processa Notificação

```typescript
// Worker escuta fila
queue.subscribe('notifications.email', async (event) => {
  await email_worker.process(event);
});

// Worker recebe evento:
{
  notification_id: 'notif_abc123',
  message_id: 'msg_unique',
  target_user_id: 'user_123',
  channel: 'email',
  template_id: 'tmpl_welcome',
  payload: { user_name: 'John Doe', email: 'john@example.com' },
  priority: 'high'
}

// Worker:
// 1. Busca notification
// 2. Busca template
// 3. Renderiza: "Welcome John Doe!"
// 4. Envia via provider
// 5. Atualiza status: 'sent'
```

### 3. Respeitar Preferências do Usuário

```typescript
// Criar preferência
const preference = new NotificationPreferenceEntity({
  user_id: 'user_123',
  category: 'marketing',
  channels: {
    email: true,
    whatsapp: false, // usuário desabilitou WhatsApp para marketing
    push: false,
  },
});

// Enviar notificação de marketing
const result = await send_notification_usecase.execute({
  target_user_id: 'user_123',
  channels: ['email', 'whatsapp', 'push'],
  template_id: 'tmpl_promo',
  payload: { promo_code: 'SAVE20' },
  category: 'marketing',
});

// Resultado: apenas 1 notificação (email)
// WhatsApp e Push foram filtrados pelas preferências
```

### 4. Override de Preferências (Admin)

```typescript
// Notificação transacional crítica (ignorar preferências)
const result = await send_notification_usecase.execute({
  target_user_id: 'user_123',
  channels: ['email', 'whatsapp', 'push'],
  template_id: 'tmpl_security_alert',
  payload: { alert_message: 'Suspicious login detected' },
  category: 'security',
  override_preferences: true, // Força envio em todos os canais
});

// Resultado: 3 notificações enviadas (ignora preferências)
```

## Templates

### Criar Template

```typescript
const template = new NotificationTemplateEntity({
  name: 'booking_confirmation',
  channel: 'email',
  subject: 'Booking confirmed for {{service}}',
  body_template: `
    <h1>Hello {{customer_name}}</h1>
    <p>Your booking for <strong>{{service}}</strong> on {{date}} is confirmed!</p>
    <p>Location: {{location}}</p>
  `,
  variables: ['customer_name', 'service', 'date', 'location'],
});

await template_repository.create(template);
```

### Renderizar Template

```typescript
const result = await render_template_usecase.execute({
  template_id: template.id,
  payload: {
    customer_name: 'Jane Smith',
    service: 'Haircut',
    date: '2024-01-20 14:00',
    location: 'Downtown Salon',
  },
});

// result.rendered_subject: "Booking confirmed for Haircut"
// result.rendered_body: "<h1>Hello Jane Smith</h1>..."
```

## Idempotência

Use `message_id` para garantir que notificações duplicadas não sejam enviadas:

```typescript
// Primeira vez
await send_notification_usecase.execute({
  message_id: 'unique_msg_123',
  target_user_id: 'user_123',
  channels: ['email'],
  template_id: 'tmpl_welcome',
  payload: {},
});
// Cria 1 notificação

// Segunda vez (mesmo message_id)
await send_notification_usecase.execute({
  message_id: 'unique_msg_123',
  target_user_id: 'user_123',
  channels: ['email'],
  template_id: 'tmpl_welcome',
  payload: {},
});
// Retorna array vazio (duplicata detectada)
```

## Tópicos de Fila

| Tópico | Canal | Worker |
|--------|-------|--------|
| `notifications.email` | Email | `EmailWorker` |
| `notifications.whatsapp` | WhatsApp | `WhatsAppWorker` |
| `notifications.push` | Push | `PushWorker` |

## Exemplos de Payloads

### Evento de Email

```json
{
  "notification_id": "notif_01HXK...",
  "message_id": "msg_unique_123",
  "target_user_id": "user_123",
  "channel": "email",
  "template_id": "tmpl_welcome",
  "payload": {
    "user_name": "John Doe",
    "email": "john@example.com",
    "signup_date": "2024-01-15"
  },
  "priority": "normal",
  "metadata": {
    "source": "signup_flow",
    "campaign_id": "camp_welcome_2024"
  }
}
```

### Evento de WhatsApp

```json
{
  "notification_id": "notif_01HXL...",
  "message_id": "msg_unique_124",
  "target_user_id": "user_123",
  "channel": "whatsapp",
  "template_id": "tmpl_booking_reminder",
  "payload": {
    "customer_name": "Maria Silva",
    "phone": "+5511999999999",
    "service": "Manicure",
    "date": "2024-01-20",
    "time": "14:00"
  },
  "priority": "high"
}
```

### Evento de Push

```json
{
  "notification_id": "notif_01HXM...",
  "message_id": "msg_unique_125",
  "target_user_id": "user_123",
  "channel": "push",
  "template_id": "tmpl_new_message",
  "payload": {
    "sender": "Alice",
    "message_preview": "Hey, are we still on for tomorrow?",
    "push_token": "device_token_abc123",
    "data": {
      "conversation_id": "conv_456",
      "message_id": "msg_789"
    }
  },
  "priority": "normal"
}
```

## Como Rodar Localmente

### 1. Instalar dependências

```bash
# API
cd apps/api
pnpm install

# Jobs
cd apps/jobs
pnpm install
```

### 2. Rodar API

```bash
cd apps/api
pnpm dev
```

### 3. Rodar Workers (exemplo local)

```bash
cd apps/jobs
pnpm tsx src/examples/local-queue-example.ts
```

## Como Trocar Implementações

### Trocar Provider de Email

1. Criar implementação:

```typescript
// apps/jobs/src/providers/sendgrid-provider.ts
import { IEmailProvider } from '../workers/email-worker';
import sgMail from '@sendgrid/mail';

export class SendGridProvider implements IEmailProvider {
  constructor(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

  async send_email(input: {
    to: string;
    subject: string;
    html: string;
  }): Promise<{ provider_id?: string }> {
    const [result] = await sgMail.send({
      to: input.to,
      from: 'noreply@myapp.com',
      subject: input.subject,
      html: input.html,
    });

    return { provider_id: result.headers['x-message-id'] };
  }
}
```

2. Injetar no worker:

```typescript
const email_provider = new SendGridProvider(process.env.SENDGRID_API_KEY);
const email_worker = new EmailWorker(
  email_provider,
  template_renderer,
  notification_repository,
  template_repository
);
```

### Trocar Implementação de Fila

1. Criar adapter (exemplo: SQS):

```typescript
// apps/api/src/infra/adapters/sqs-queue.adapter.ts
import { IQueue } from '@/application/contracts/i-queue.interface';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

export class SQSQueueAdapter implements IQueue {
  constructor(private sqs: SQSClient) {}

  async publish<T>(topic: string, message: T): Promise<void> {
    await this.sqs.send(
      new SendMessageCommand({
        QueueUrl: this.getQueueUrl(topic),
        MessageBody: JSON.stringify(message),
      })
    );
  }

  async subscribe<T>(topic: string, handler: (message: T) => Promise<void>): Promise<void> {
    // Implementar polling ou usar Lambda trigger
  }

  private getQueueUrl(topic: string): string {
    const urls: Record<string, string> = {
      'notifications.email': process.env.EMAIL_QUEUE_URL!,
      'notifications.whatsapp': process.env.WHATSAPP_QUEUE_URL!,
      'notifications.push': process.env.PUSH_QUEUE_URL!,
    };
    return urls[topic];
  }
}
```

2. Injetar no DI:

```typescript
// apps/api/src/infra/di/factories/clients.factory.ts
const sqs = new SQSClient({ region: 'us-east-1' });
const queue = new SQSQueueAdapter(sqs);
```

## Testes

### Rodar testes unitários

```bash
cd apps/api
pnpm test
```

### Testes incluídos

- `send-notification.usecase.spec.ts` - Testa orquestração, preferências, idempotência
- `render-template.usecase.spec.ts` - Testa renderização de templates

## Próximos Passos

1. **Implementar providers reais**: SendGrid, Twilio, Firebase
2. **Configurar fila de produção**: SQS, RabbitMQ, Cloudflare Queues
3. **Adicionar controllers HTTP**: APIs para criar templates, gerenciar preferências
4. **Webhooks**: Receber status de entrega dos providers
5. **Retry/DLQ**: Melhorar tratamento de falhas persistentes

## Documentação Relacionada

- [AI Context](./AI_CONTEXT.md) - Padrões arquiteturais do projeto
- [Jobs README](../../jobs/README.md) - Detalhes do app de workers
