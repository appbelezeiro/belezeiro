import { Logger } from '../config/logger';
import { MetricsCollector } from '../config/metrics';
import type { NotificationEvent } from '../types/notification-event';

export interface IEmailProvider {
  send_email(input: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    metadata?: Record<string, any>;
  }): Promise<{ provider_id?: string }>;
}

export interface ITemplateRenderer {
  render(template: string, variables: Record<string, any>): string;
}

export interface INotificationRepository {
  find_by_id(id: string): Promise<any | null>;
  update(entity: any): Promise<any>;
}

export interface ITemplateRepository {
  find_by_id(id: string): Promise<any | null>;
}

export class EmailWorker {
  private logger: Logger;
  private metrics: MetricsCollector;
  private retry_attempts = 3;
  private retry_delay_ms = 2000;

  constructor(
    private email_provider: IEmailProvider,
    private template_renderer: ITemplateRenderer,
    private notification_repository: INotificationRepository,
    private template_repository: ITemplateRepository
  ) {
    this.logger = new Logger('EmailWorker');
    this.metrics = new MetricsCollector();
  }

  async process(event: NotificationEvent): Promise<void> {
    const start_time = Date.now();

    this.logger.info('Processing email notification', {
      notification_id: event.notification_id,
      message_id: event.message_id,
      target_user_id: event.target_user_id,
    });

    try {
      // 1. Buscar notificação
      const notification = await this.notification_repository.find_by_id(
        event.notification_id
      );

      if (!notification) {
        this.logger.error('Notification not found', undefined, {
          notification_id: event.notification_id,
        });
        return;
      }

      // 2. Buscar template
      const template = await this.template_repository.find_by_id(event.template_id);

      if (!template) {
        this.logger.error('Template not found', undefined, {
          template_id: event.template_id,
        });
        notification.mark_as_failed('Template not found');
        await this.notification_repository.update(notification);
        return;
      }

      // 3. Renderizar template
      const subject = template.subject
        ? this.template_renderer.render(template.subject, event.payload)
        : 'Notification';

      const html = this.template_renderer.render(
        template.body_template,
        event.payload
      );

      // 4. Enviar email com retry
      let last_error: Error | undefined;
      let provider_id: string | undefined;

      for (let attempt = 1; attempt <= this.retry_attempts; attempt++) {
        try {
          const result = await this.email_provider.send_email({
            to: event.payload.email || event.target_user_id,
            subject,
            html,
            metadata: {
              notification_id: event.notification_id,
              message_id: event.message_id,
              ...event.metadata,
            },
          });

          provider_id = result.provider_id;
          break; // Sucesso
        } catch (error) {
          last_error = error as Error;
          this.logger.warn('Email send attempt failed', {
            attempt,
            max_attempts: this.retry_attempts,
            error: last_error.message,
          });

          if (attempt < this.retry_attempts) {
            await this.delay(this.retry_delay_ms * attempt);
          }
        }
      }

      // 5. Atualizar status da notificação
      if (provider_id) {
        notification.mark_as_sent(provider_id);
        await this.notification_repository.update(notification);

        const duration = Date.now() - start_time;
        this.logger.info('Email notification sent successfully', {
          notification_id: event.notification_id,
          provider_id,
          duration_ms: duration,
        });

        this.metrics.increment('notifications_sent_total', {
          channel: 'email',
          status: 'success',
        });
        this.metrics.histogram('notification_send_duration_ms', duration, {
          channel: 'email',
        });
      } else {
        const error_message = last_error?.message || 'Unknown error';
        notification.mark_as_failed(error_message);
        await this.notification_repository.update(notification);

        this.logger.error('Email notification failed after retries', last_error, {
          notification_id: event.notification_id,
          attempts: this.retry_attempts,
        });

        this.metrics.increment('notifications_sent_total', {
          channel: 'email',
          status: 'failed',
        });
      }
    } catch (error) {
      this.logger.error('Unexpected error processing email notification', error as Error, {
        notification_id: event.notification_id,
      });

      this.metrics.increment('notifications_sent_total', {
        channel: 'email',
        status: 'error',
      });

      throw error; // Re-throw para DLQ
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
