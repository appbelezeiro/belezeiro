# Jobs & Workers - Notification System

Background job processing system for handling notifications across multiple channels (Email, WhatsApp, Push).

## Architecture

This application follows a **worker-based architecture** where:

1. **API** publishes notification events to queues
2. **Workers** consume these events and send notifications via providers
3. **Providers** are abstracted through interfaces (Email, WhatsApp, Push)
4. **Queues** are abstracted through the `IQueue` interface

```
┌─────────────────┐
│      API        │
│  (Publisher)    │
└────────┬────────┘
         │ publish events
         ▼
┌─────────────────┐
│     Queue       │
│  (IQueue impl)  │
└────────┬────────┘
         │ subscribe
         ▼
┌─────────────────┐
│    Workers      │
│  Email/WA/Push  │
└────────┬────────┘
         │ send via
         ▼
┌─────────────────┐
│   Providers     │
│  (IProvider)    │
└─────────────────┘
```

## Features

- ✅ **Multi-channel support**: Email, WhatsApp, Push notifications
- ✅ **Queue abstraction**: Pluggable queue implementations (in-memory, SQS, RabbitMQ, Cloudflare Queues)
- ✅ **Provider abstraction**: Pluggable providers (SendGrid, Twilio, FCM, etc.)
- ✅ **Retry mechanism**: Configurable retry with exponential backoff
- ✅ **Idempotency**: Message deduplication via `message_id`
- ✅ **Observability**: Structured logging and metrics
- ✅ **Template rendering**: Handlebars-based template system
- ✅ **Health checks**: `/health` endpoint for monitoring
- ✅ **Cloudflare Workers ready**: Configured with wrangler

## Directory Structure

```
apps/jobs/
├── src/
│   ├── config/
│   │   ├── logger.ts           # Structured logging
│   │   └── metrics.ts          # Metrics collector
│   ├── workers/
│   │   ├── email-worker.ts     # Email notification processor
│   │   ├── whatsapp-worker.ts  # WhatsApp notification processor
│   │   └── push-worker.ts      # Push notification processor
│   ├── types/
│   │   └── notification-event.ts # Event type definitions
│   ├── examples/
│   │   └── local-queue-example.ts # Local development example
│   ├── server.ts               # Hono server (health checks)
│   └── index.ts                # Entry point
├── package.json
├── tsconfig.json
├── wrangler.toml              # Cloudflare Workers config
└── README.md
```

## Getting Started

### Installation

```bash
cd apps/jobs
pnpm install
```

### Development

Run the server locally:

```bash
pnpm dev
```

The server will start on `http://localhost:3001`

**Endpoints:**
- `GET /` - Service information
- `GET /health` - Health check
- `GET /metrics` - Metrics endpoint

### Running the Local Queue Example

To test the full notification flow locally with in-memory providers:

```bash
pnpm tsx src/examples/local-queue-example.ts
```

This will:
1. Set up in-memory queue and mock providers
2. Register workers for each channel
3. Publish test notification events
4. Process them end-to-end

### Testing

```bash
pnpm test
```

## How It Works

### 1. Event Publishing (from API)

The API publishes notification events to the queue:

```typescript
const event: NotificationEvent = {
  notification_id: 'notif_abc123',
  message_id: 'msg_unique_id',
  target_user_id: 'user_123',
  channel: 'email',
  template_id: 'tmpl_welcome',
  payload: {
    user_name: 'John Doe',
    email: 'john@example.com',
  },
  priority: 'normal',
  metadata: {
    source: 'signup_flow',
  },
};

await queue.publish('notifications.email', event);
```

### 2. Worker Processing

Workers subscribe to queue topics and process events:

```typescript
// Email Worker
await queue.subscribe('notifications.email', async (event) => {
  await email_worker.process(event);
});

// WhatsApp Worker
await queue.subscribe('notifications.whatsapp', async (event) => {
  await whatsapp_worker.process(event);
});

// Push Worker
await queue.subscribe('notifications.push', async (event) => {
  await push_worker.process(event);
});
```

### 3. Worker Flow

Each worker follows this flow:

1. **Fetch notification** from repository
2. **Fetch template** from repository
3. **Render template** with payload variables
4. **Send via provider** with retry logic
5. **Update notification status** (sent/failed)
6. **Log and emit metrics**

### 4. Retry Logic

Workers implement exponential backoff retry:

```typescript
retry_attempts = 3
retry_delay_ms = 2000

Attempt 1: fails → wait 2s
Attempt 2: fails → wait 4s
Attempt 3: fails → wait 6s
→ Mark as failed
```

### 5. Idempotency

Duplicate messages are prevented via `message_id`:

```typescript
// First execution
await send_notification({ message_id: 'msg_123', ... });
// Creates notification

// Second execution (same message_id)
await send_notification({ message_id: 'msg_123', ... });
// Returns empty array (idempotent)
```

## Queue Topics

| Topic | Channel | Description |
|-------|---------|-------------|
| `notifications.email` | Email | Email notifications |
| `notifications.whatsapp` | WhatsApp | WhatsApp messages |
| `notifications.push` | Push | Push notifications |

## Adapting Providers

### Replacing Mock Providers

To use real providers (e.g., SendGrid for email):

1. **Create provider implementation:**

```typescript
// src/providers/sendgrid-email.provider.ts
import { IEmailProvider } from '../workers/email-worker';
import sgMail from '@sendgrid/mail';

export class SendGridEmailProvider implements IEmailProvider {
  constructor(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

  async send_email(input: {
    to: string;
    subject: string;
    html: string;
  }): Promise<{ provider_id?: string }> {
    const result = await sgMail.send({
      to: input.to,
      from: 'noreply@example.com',
      subject: input.subject,
      html: input.html,
    });

    return { provider_id: result[0].headers['x-message-id'] };
  }
}
```

2. **Inject in worker initialization:**

```typescript
const email_provider = new SendGridEmailProvider(process.env.SENDGRID_API_KEY);
const email_worker = new EmailWorker(
  email_provider,
  template_renderer,
  notification_repository,
  template_repository
);
```

### Replacing Queue Implementation

To use a real queue (e.g., AWS SQS):

1. **Create queue implementation:**

```typescript
// src/adapters/sqs-queue.adapter.ts
import { IQueue } from '@/application/contracts/i-queue.interface';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

export class SQSQueueAdapter implements IQueue {
  constructor(private sqs: SQSClient) {}

  async publish<T>(topic: string, message: T): Promise<void> {
    await this.sqs.send(
      new SendMessageCommand({
        QueueUrl: this.get_queue_url(topic),
        MessageBody: JSON.stringify(message),
      })
    );
  }

  async subscribe<T>(topic: string, handler: (message: T) => Promise<void>): Promise<void> {
    // Poll SQS and invoke handler
  }

  private get_queue_url(topic: string): string {
    return process.env[`${topic.toUpperCase()}_QUEUE_URL`]!;
  }
}
```

2. **Use in initialization:**

```typescript
const queue = new SQSQueueAdapter(new SQSClient({ region: 'us-east-1' }));
```

## Cloudflare Workers Deployment

### Configuration

Edit `wrangler.toml` to configure your Cloudflare Queues:

```toml
[[queues.producers]]
queue = "notifications-email"
binding = "NOTIFICATIONS_EMAIL_QUEUE"

[[queues.consumers]]
queue = "notifications-email"
max_batch_size = 10
max_batch_timeout = 30
```

### Deployment

```bash
# Login to Cloudflare
pnpm wrangler login

# Deploy to Cloudflare Workers
pnpm wrangler:deploy
```

### Local Development with Wrangler

```bash
pnpm wrangler:dev
```

## Observability

### Structured Logging

All logs are JSON-formatted:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Email notification sent successfully",
  "context": {
    "service": "EmailWorker",
    "notification_id": "notif_abc123",
    "provider_id": "sendgrid_xyz789",
    "duration_ms": 250
  }
}
```

### Metrics

Workers emit metrics for monitoring:

- `notifications_sent_total{channel, status}` - Counter of sent notifications
- `notification_send_duration_ms{channel}` - Histogram of send latency

Example metric output:

```json
{
  "metric": true,
  "name": "notifications_sent_total",
  "type": "counter",
  "value": 1,
  "labels": {
    "channel": "email",
    "status": "success"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Error Handling

### Retry Behavior

Workers retry failed sends with exponential backoff. After exhausting retries, the notification is marked as `failed` with the error message.

### Dead Letter Queue (DLQ)

For production deployments, configure a DLQ to capture permanently failed messages:

```typescript
// If worker throws after retries, message goes to DLQ
throw new Error('Permanent failure'); // → DLQ
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `SENDGRID_API_KEY` | SendGrid API key (if using) | - |
| `TWILIO_*` | Twilio credentials (if using) | - |
| `FCM_*` | Firebase Cloud Messaging config (if using) | - |

## Performance

- **In-memory queue**: Suitable for development and low-volume production
- **External queue (SQS, RabbitMQ)**: Recommended for high-volume production
- **Batch processing**: Cloudflare Queues support batch processing for efficiency
- **Retry delays**: Configurable per worker type

## Next Steps

1. **Implement real providers**: Replace mock providers with SendGrid, Twilio, FCM
2. **Set up production queue**: SQS, RabbitMQ, or Cloudflare Queues
3. **Configure monitoring**: Integrate with Datadog, Prometheus, or CloudWatch
4. **Add DLQ handling**: Process failed messages from DLQ
5. **Implement webhooks**: Listen to provider webhooks for delivery status

## Related Documentation

- [API Documentation](../api/docs/AI_CONTEXT.md)
- [Notification Module](../api/src/domain/entities/notification.entity.ts)
- [Queue Interface](../api/src/application/contracts/i-queue.interface.ts)
